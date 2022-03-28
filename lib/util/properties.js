'use strict';

module.exports = {
    applicationName:   process.env.APPLICATION_NAME || 'collect-listing-api-dev' ,
    awsRegion:         process.env.REGION || "eu-central-1",
    eventBus:          process.env.EVENT_BUS || "collect-events-dev",
    logLevel:          process.env.LOG_LEVEL || "INFO",
    productIdMappingTable: process.env.IDENTITY_TABLE || "collect-identity-dev",
};
