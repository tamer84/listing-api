
process.env.APPLICATION_NAME = 'listing-api-local-test'
process.env.EVENT_BUS = 'kahula-events-dev'
process.env.PRODUCTID_MAPPING_TABLE = 'col-id-mapping-dev'

const handler = require('../lib/handler/post-handler');
const postBody = require('./fixtures/post-request-body');
const awsEvent = require('./fixtures/post-request');
awsEvent.body = JSON.stringify(postBody); // replace the body with the post-request-body because its easier to update that way

handler.process(awsEvent)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error(err);
    })

