'use strict';

const PutHandler  = require('./put-handler');


const process = async (request) => {

  return PutHandler.process(request)
}

module.exports = { process }
