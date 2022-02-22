'use strict';

const ApiError   = require('../../api/api-error');
const Properties = require("../../util/properties");

module.exports = class KahulaEvent {

    constructor({domain, eventName, productId, sagaId, market}) {
        this.domain = domain;
        this.eventName = eventName;
        this.market = market;
        this.productId = productId;
        this.productType = 'COLLECT';
        this.sagaId = sagaId;
        this.source = Properties.applicationName;
        this.timestamp = Date.now();

        const missing = [];
        if(! domain) missing.push('domain');
        if(! eventName) missing.push('eventName')
        if(! productId) missing.push('productId')
        if(! sagaId) missing.push('sagaId')
        if(! market) missing.push('market');
        if(missing.length > 0)
            throw ApiError.internalError(sagaId || 'xxx', `Event missing required fields: [${missing}]`);
    }

    detailType() {
        return this.constructor.name;
    }

}
