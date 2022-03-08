const TangoEvent = require("./_tango-event");

module.exports = class IceCreamStockItemUpdatedEvent extends TangoEvent {

    constructor({productId, sagaId, id, metadata, productRecord, vendor}) {
        super({
            eventName: 'com.tamer84.tango.icecream.domain.icsi.event.' + IceCreamStockItemUpdatedEvent.name,
            domain: 'ICE_CREAM',
            productId,
            sagaId,
            market: metadata.market
        });

        this.id = id;
        this.metadata = metadata;
        this.productRecord = productRecord;
        this.vendor = vendor;
    }
}
