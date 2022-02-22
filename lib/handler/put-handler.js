'use strict';

const {ApiResponse, ApiGateway200, ApiGatewayError} = require('../api');
const listingService = require('../listing-service');

/**
 * Process a PUT request from the API gateway
 */
const process = async (request) => {

    const sagaId = request.requestContext.requestId;

    try {

        const listing = listingService.resolveListing(sagaId, JSON.parse(request.body));

        const market = listing.metadata.market;
        const code = listing.productRecord.code;

        const productId = await listingService.getOrCreateProductId({sagaId, market, code});

        await listingService.publishChanges({sagaId, productId, listing})

        return ApiGateway200(
            sagaId,
            ApiResponse({sagaId, productId, message: 'Listing updated'})
        );

    } catch (err) {
        return ApiGatewayError(sagaId, err);
    }
};

/**
 *
 */

module.exports = {process};
