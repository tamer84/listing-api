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
    stageImage: Joi.boolean().default(false),
    youtubeVideoUrl: Joi.string().uri().allow(null),
    url: Joi.string().uri().required()
});

/**
 * Category
 */
const Category = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    localizedName: Joi.string().allow(null)
});

const Metadata = Joi.object({
    market: Joi.string().pattern(REGEX_MARKET).valid(...Object.values(Enums.Market)).required(),
    sourceSystem: Joi.string().allow(null).default(null)
});

/**
 * Stock
 */
const Stock = Joi.object({
    quantity: Joi.number().integer().required(),
    availabilityStatus: Joi.string().valid(...Object.values(Enums.AvailabilityStatus)).required()
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
    value: Money.required(),
    strikePrice: Joi.boolean().default(false),
    priceType: Joi.string().valid(...Object.values(Enums.PriceType))
})

const PriceRange = Joi.object({
    maxPrice: Price.required(),
    minPrice: Price.required(),
})

/**
 * Color
 */
const Color = Joi.object( {
    baseColor: Joi.string().valid(...Object.values(Enums.Color)).description('Article color group - UNDEFINED for no color'),
    colorCode: Joi.string().allow(null),
    manufacturerColor: Joi.string().allow(null).description('Manufacturer own color description')
})

/**
 * Size
 */
const Size = Joi.object( {
    sizeValue: Joi.string().allow(null).description('bla'),
    webSize: Joi.string().allow(null).description('Size value to display online')
})

/**
 * Variant
 */
const Variant = Joi.object({
    code: Joi.string().required().description('Article code'),
    color: Color.allow(null),
    size: Size.allow(null).description('Article size group (applicable for clothing)'),
    pricing: Joi.object({
        price: Price.allow(null).default(null),
        priceRange: PriceRange.allow(null).default(null),
        vatReclaimable: Joi.boolean().allow(null)
    }).allow(null),
    media: Joi.object({
        images:      Joi.array().items(MediaItem).default([]),
        videos:      Joi.array().items(MediaItem).default([])
    }),
    stock: Stock.required()
})

/**
 * Product Record
 */
const ProductRecord = Joi.object({
    productName: Joi.string().required().description('Product name'),

    code: Joi.string().required().description('Product inventory code'),

    shortDescription: Joi.string().required().description('Product marketing summary description'),

    categories: Joi.array().allow(null).items(Category.default([])).description('Product marketing categories'),

    defaultCategory: Category.allow(null).default(null).description('Default category for product'),

    propertiesLegal:  Joi.string().allow(null).default(null).description('Legally mandatory product information'),

    vendor: Joi.string().allow(null).default(null).description("Producer"),

    variants: Joi.array().items(Variant.default([])).description("Product variants"),

    summaryHtml: Joi.string().allow(null),

    productType: Joi.string().required()
})

/**
 * Listing schema
 */
const listingSchema = Joi.object({
    metadata: Metadata.required(),
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

