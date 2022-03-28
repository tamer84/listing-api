
process.env.PRODUCTID_MAPPING_TABLE = 'col-id-mapping-dev'
process.env.APPLICATION_NAME = 'listing-api-integration-dev'

const handler = require('../lib/handler/put-handler');
const putBody = require('./fixtures/put-request-body2');
const awsEvent = require('./fixtures/put-request');
awsEvent.body = JSON.stringify(putBody); // replace the body with the post-request-body because its easier to update that way

handler.process(awsEvent)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error(err);
    })

