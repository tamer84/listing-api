'use strict';

const { DynamoDBClient }    = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient } = require('@aws-sdk/client-eventbridge');
const Properties            = require("./properties");

const getDynamoDBClient = () => new DynamoDBClient({ region: Properties.awsRegion });

const getEventBridgeClient = () => new EventBridgeClient({ region: Properties.awsRegion });

module.exports = {
  getDynamoDBClient,
  getEventBridgeClient,
};
