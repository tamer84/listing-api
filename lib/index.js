'use strict';

const ApiError          = require('../lib/api/api-error');
const {ApiGatewayError} = require('../lib/api');
const log               = require('./util/logger');
const RequestProcessor  = require('./handler/request-handler');

exports.handler = async (request) => {
  try {
    return RequestProcessor.process(request)
  }
  catch (err) {
    log.error({err}, 'Something went seriously wrong');
    return ApiGatewayError('xxx', ApiError.internalError('xxx'));
  }
}
