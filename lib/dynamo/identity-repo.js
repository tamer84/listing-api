'use strict';

const { PutItemCommand, UpdateItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const client     = require("../util/IocContainer").getDynamoDBClient();
const Properties = require("../util/properties");
const log = require("../util/logger");

module.exports = {

    create({productId, externalId}) {
        const saveTime = Date.now();

        const Item = {
            id: { S: productId },
            externalId: { S: externalId },
            createdAt: { N: `${saveTime}` },
            updatedAt: { N: `${saveTime}` }
        };

        return client.send(
            new PutItemCommand({
                TableName: Properties.productIdMappingTable,
                Item
            })
        ).then(resp => resp.$metadata.httpStatusCode === 200 || resp.$metadata.httpStatusCode === 201)
    },


    getByExternalId(externalId)  {
        return client.send(
            new QueryCommand({
                TableName: Properties.productIdMappingTable,
                IndexName: "externalId-index",
                KeyConditionExpression: "externalId = :id",
                ExpressionAttributeValues: {
                    ":id": { S: externalId }
                }
            })
        ).then(resp => {
            if(resp.Items.length === 0) return null; /* not found */
            return _transformIdentityResponse(resp.Items[0]);
        })
    },

    delete(productId){

        const params = {
            TableName: Properties.productIdMappingTable,
            Key: {
                id: { S: productId }
            },
            UpdateExpression: "SET deleted = :deleted, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":deleted": { S: 'x' },
                ":updatedAt": { N: `${Date.now()}` }
            }
        };

        return client.send(new UpdateItemCommand(params)).then(resp => resp.$metadata.httpStatusCode === 200)
    },

    /**
     * Update identity mapping
     *
     * Only update the updatedAt timestamp for USED.
     *
     * For NEW, update the FIN if its provided.
     *
     * @param productId
     * @param payload
     * @returns {Promise<boolean>}
     */
    update({productId})  {

        let UpdateExpression = 'SET updatedAt = :updatedAt';
        const ExpressionAttributeValues = {
            ":updatedAt": { N: `${Date.now()}` }
        }

        const params = {
            TableName: Properties.productIdMappingTable,
            Key: {
                id: { S: productId }
            },
            UpdateExpression,
            ExpressionAttributeValues
        };

        return client.send(new UpdateItemCommand(params)).then(resp => resp.$metadata.httpStatusCode === 200)
    }

}

/**
 * Returns dynamo identity response into a friendlier format.
 *
 * This
 * <pre><code>
 *     {"fin":{"S":"W1K2053191G003629"},"id":{"S":"35a769f3-0c3d-4a7c-b7b9-dab198c6318f"},"orderNumber":{"S":"0953175664"}}
 * </pre></code>
 *
 * Becomes
 * <pre><code>
 *     {"fin": "W1K2053191G003629","id": "35a769f3-0c3d-4a7c-b7b9-dab198c6318f","orderNumber": "0953175664"}
 * </pre></code>
 */
function _transformIdentityResponse(data) {
    if(! data) return null;
    const identity = {};
    Object.keys(data).forEach(k => {
        const field = data[k]
        identity[k] = field?.S || field?.N || null
    })
    return identity;
}
