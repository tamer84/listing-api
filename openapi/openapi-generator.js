
const fs              = require('fs');
const path            = require('path');
const j2s             = require('joi-to-swagger');
const template        = require('./openapi-template');
const schema          = require('../lib/schema');


const listingResult      = j2s(schema.listingSchema, {});

template.components.schemas.Listing      = listingResult.swagger;

try {
    const file = path.resolve(__dirname, 'openapi-listing.json');
    const data = fs.writeFileSync(file, JSON.stringify(template, null, 2));
    //file written successfully
} catch (err) {
    console.error(err)
}


