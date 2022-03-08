
'use strict';

const IceCreamStockItemUpdatedEvent     = require("./model/icecream-stock-item-updated-event");

module.exports = {

    generateEvents({sagaId, productId, listing}) {

        return [
            new IceCreamStockItemUpdatedEvent({productId, sagaId, ...listing}),
        ];
    }
}
