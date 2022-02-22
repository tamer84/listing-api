
'use strict';

const CollectStockItemUpdatedEvent     = require("./model/collect-stock-item-updated-event");

module.exports = {

    generateEvents({sagaId, productId, listing}) {

        return [
            new CollectStockItemUpdatedEvent({productId, sagaId, ...listing}),
        ];
    }
}
