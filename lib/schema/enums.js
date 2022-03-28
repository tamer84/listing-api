'use strict';

const AvailabilityStatus = Object.freeze({
    AVAILABLE : 'AVAILABLE',
    DELISTED : 'DELISTED',
    RESERVED : 'RESERVED',
    ORDERED : 'ORDERED',
    ORDER_CONFIRMED : 'ORDER_CONFIRMED',
    SOLD : 'SOLD',
    UNAVAILABLE : 'UNAVAILABLE'
});

const Market = Object.freeze({
    DE: 'DE',
    FR: 'FR'
});

const PriceType = Object.freeze({
    BUY: 'BUY',
    FROM: 'FROM'
});

const Color = Object.freeze({
    BLACK : 'BLACK',
    SILVER : 'SILVER',
    GOLD : 'GOLD',
    BLUE : 'BLUE',
    WHITE : 'WHITE',
    BROWN : 'BROWN',
    GREY : 'GREY',
    BEIGE: 'BEIGE',
    YELLOW: 'YELLOW',
    GREEN: 'GREEN',
    RED: 'RED',
    TURQUOISE: 'TURQUOISE',
    ORANGE: 'ORANGE',
    PINK: 'PINK',
    CARBON: 'CARBON',
    PURPLE: 'PURPLE',
    CHROME: 'CHROME',
    UNDEFINED: 'UNDEFINED'
});

const MediaSourceSystem = Object.freeze({
    CUSTOMER_SOLUTIONS_MEDIA: 'CSM'
});

const MediaType = Object.freeze({
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO'
});

const StockStatus = Object.freeze({
    INSTOCK: 'INSTOCK',
    OUTOFSTOCK: 'OUTOFSTOCK'
});

module.exports = {
    AvailabilityStatus,
    Color,
    Market,
    MediaSourceSystem,
    MediaType,
    PriceType,
    StockStatus
}
