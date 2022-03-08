'use strict';

const { ApiError } = require('./api');
const eventAdaptor   = require("./events/event-adapter");
const eventBus       = require("./events/event-bridge");
const identityRepo   = require("./dynamo/identity-repo");
const log            = require("./util/logger");
const schema         = require('./schema');
const { v4: uuid }   = require("uuid");

module.exports = {

    resolveListing(sagaId, body) {
        const {listing, errors} = schema.validateListing(body);
        if(errors) throw ApiError.badRequest(sagaId, errors);
        return listing;
    },

    async getOrCreateProductId({sagaId, market, code}) {

        log.info({sagaId}, `Finding identity record [code=${code}, market=${market}]`)

        const externalId = `${market}_${code}`;

        const record = await identityRepo.getByExternalId(externalId);
        if(record) {
            log.info('Identity record exists, reusing existing id');
            return record.id;
        }

        const productId = uuid();

        log.info({sagaId, externalId, productId}, `Creating identity record`);

        const created = await identityRepo.create({productId, externalId});

        if(! created) throw ApiError.internalError(sagaId, 'Failed to create identity record');

        return productId;
    },

    async getOrCreateProductId2({sagaId, market, code}) {
        const productId = uuid();
        return productId;
    },

    async publishChanges({sagaId, productId, listing}) {

        const events = eventAdaptor.generateEvents({sagaId, productId, listing});

        const published = await eventBus.publish(events);

        log.info({sagaId, productId, published}, 'Publishing complete');

    }

}
