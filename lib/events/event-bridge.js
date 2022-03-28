'use strict';

const eventBridgeClient    = require("../util/IocContainer").getEventBridgeClient();
const log                  = require("../util/logger");
const Properties           = require("../util/properties");
const { PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const EVENT_LIMIT  = 10;
const EVENT_BUS    = Properties.eventBus;
const EVENT_SOURCE = Properties.applicationName;

/**
 * As the EventBridge can process 10 events in a single request
 * the vehicles are split into chunks of 10
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eventbridge/index.html
 * @param events
 */
function createEventChunks(events) {

    const eventChunks = []

    for(let i = 0; i < events.length; i += EVENT_LIMIT){
        const slice = events.slice(i,i+EVENT_LIMIT)
        eventChunks.push(slice)
    }
    return eventChunks
}


/**
 * Send Events.
 *
 * This function is built to handle errors.  The total errors are returned
 * @param events
 * @returns {Promise<*|number|number>} the total number of errors
 */
async function sendEvents(events) {

    const totalEvents = events.length;

    if (! events || events.length === 0)
        return totalEvents;

    const {sagaId, productId} = events[0];

    if(! sagaId || ! productId) {
        log.error('Event missing sagaId or productId');
        return totalEvents;
    }

    try {

        log.info({sagaId, productId}, `Publishing events [count=${events.length}]`)

        const eventRequest = {
            Entries: events.map(event => {
                log.info({sagaId, productId}, `Publishing ${event.detailType()}`)
                return {
                    DetailType: event.detailType(),
                    EventBusName: EVENT_BUS,
                    Source: EVENT_SOURCE,
                    Time: new Date(),
                    Detail: JSON.stringify(event),
                }
            }),
        };

        const result = await eventBridgeClient.send(new PutEventsCommand(eventRequest))
        log.info({result, sagaId, productId}, 'Publish result');
        return result.FailedEntryCount || 0;
    }
    catch(err) {
        log.error({err, sagaId, productId}, 'Unexpected event_bridge failure. Most likely coding error');
        return totalEvents;
    }
}


module.exports = {

    async publish(events) {
        const result = {
            totalErrors: 0,
            totalEvents: events?.length || 0
        };

        if(result.totalEvents === 0) {
            log.warn('No events provided to publish');
            return result;
        }

        const chunks = createEventChunks(events);
        const errors = await Promise.all(chunks.map(chunk => sendEvents(chunk)) );

        result.totalErrors = errors.reduce((a, b) => a + b, 0);

        return result;
    }
}
