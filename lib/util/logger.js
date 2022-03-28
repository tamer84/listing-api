'use strict';

const bunyan = require('bunyan')
const Properties = require('./properties')
const ApiError = require("../api/api-error");

const log = bunyan.createLogger(
    {
      name: Properties.applicationName || process.env.npm_package_name,
      version: process.env.npm_package_version,
      serializers: {
          err: function(err) {
              if(err instanceof ApiError) {
                  return err;
              }
              return bunyan.stdSerializers.err(err);
          },
      },
      streams: [
        {
          level: Properties.logLevel ||'INFO',
          stream: process.stdout,
        },
      ],
    },
  );

module.exports = log
