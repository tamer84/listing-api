'use strict';

const log = require("../util/logger");
const ApiError = require('./api-error');


module.exports.ApiError = ApiError

module.exports.ApiResponse = ({sagaId, productId, message}) => {
    return {
        reqId: sagaId,
        message: message || 'Request complete',
        productId: productId || null
    }
}

const ApiGatewaySuccess = (id, code, body) => {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'x-kahula-trace-id': id
        },
        body: JSON.stringify(body)
    }
}

module.exports.ApiGateway200 = (id, body) => {
    return ApiGatewaySuccess(id, 200, body);
}
module.exports.ApiGateway201 = (id, body) => {
    return ApiGatewaySuccess(id, 201, body);
}

module.exports.ApiGatewayError = (sagaId, err) => {

    log.error({sagaId, err});

    const error = err instanceof ApiError ? err : ApiError.internalError(sagaId);

    return {
        statusCode: error?.code || 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'x-kahula-trace-id': sagaId || 'not_available'
        },
        body: JSON.stringify(error)
    }
}

