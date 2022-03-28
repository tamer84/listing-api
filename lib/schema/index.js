'use strict';

const Joi = require('joi');
const Enums = require('./enums');

const REGEX_CURRENCY_CODE = /^[A-Z]{3}$/
const REGEX_MARKET        = /^[A-Z]{2}$/;


/**
 * MediaItem
 */
const MediaItem = Joi.object({

    altText: Joi.string().allow(null),
    format: Joi.string().allow(null),
    headline: Joi.string().allow(null),
    imageType: Joi.string().allow(null),
    youtubeVideoUrl: Joi.string().uri().allow(null),
    url: Joi.string().uri().required()
});


const Metadata = Joi.object({
    market: Joi.string().pattern(REGEX_MARKET).valid(...Object.values(Enums.Market)).required(),
    sourceSystem: Joi.string().allow(null).default(null)
});


/**
 * Money
 */
const Money = Joi.number().strict().precision(2).min(0);

/**
 * Price
 */
const Price = Joi.object({
    currency:   Joi.string().pattern(REGEX_CURRENCY_CODE).description('ISO 4217 currency code').required(),
    value: Money.required()
})

/**
 * Product Record
 */
const ProductRecord = Joi.object({

    code: Joi.string().required().description('Product inventory code'),

    productName: Joi.string().required().description('Product name'),

    shortDescription: Joi.string().required().description('Product marketing summary description'),

    coneType:  Joi.string().required().description('Cone flavour'),

    topping:  Joi.string().required().description('Topping(s)'),

    flavour: Joi.string().required()
})

/**
 * Listing schema
 */
const listingSchema = Joi.object({
    media: Joi.object({
        images:      Joi.array().items(MediaItem).default([])
    }),
    metadata: Metadata.required(),
    pricing: Joi.object({
            price: Price.required()
        }),
    productRecord: ProductRecord.required()
});

module.exports = {

    listingSchema,
    validateListing(payload) {
        const {value, errors} = validatePayload(listingSchema, payload);
        return {
            listing: errors ? null : value,
            errors
        }
    }
}

function validatePayload(schema, payload) {
    const result = schema.validate(payload, {
        // abortEarly allows the code to capture all errors
        abortEarly: false,
        errors: {
            wrap: {
                // ensures that strings are not escaped in the error messages
                label: ''
            }
        }
    });
    result.errors = result.error ? result.error.details.map(d => d.message) : null;
    return result
}

