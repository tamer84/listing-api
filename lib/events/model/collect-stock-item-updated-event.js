const KahulaEvent = require("./_kahula-event");

module.exports = class CollectStockItemUpdatedEvent extends KahulaEvent {

    constructor({productId, sagaId, id, metadata, productRecord, vendor}) {
        super({
            eventName: 'io.mb.kahula.collect.domain.csi.event.' + CollectStockItemUpdatedEvent.name,
            domain: 'COLLECT_STOCK_ITEM',
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
