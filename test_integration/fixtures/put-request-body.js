const Joi = require("joi");

module.exports = {

  "market": "DE",

  "productRecord": {
    "productName": "Winterparka Herren",

    "code": "c08575f9-aced-4c98-8f53-8f3596e17dca",

    "shortDescription": "bl bla bla",

    "categories": [
      {
        "code": "DCP_Size",
        "name": "Size"
      },
      {
        "code": "DCP_Color",
        "name": "Color"
      }
    ],

    "defaultCategory": {
      "code": "DCP_Color",
      "name": "Color"
    },

    "propertiesLegal": "Produkteigenschaften: Material: 100% Polyester",

    "vendor": "Mercedes-Benz Customer Solutions GmbH",

    "variants": [
      {
        "code": "B67871177",
        "pricing": {
          "currency":   "EUR",
          "value": 149.90,
          "priceType": "BUY"
        },
        "media": {
          "images": [{
            "id": 0,
            "resourceUrl": "https://customersolutions-media.mercedes-benz.com/medienbank/shop_big/70563.png",
            "sourceSystem": "CSM"
          }
          ]
        },
        "color": {
          "baseColor": "BLACK"
        },
        "size": {
          "webSize": "M"
        },
        "stockStatus": {
          "count": 5,
          "status": "INSTOCK"
        }
      }
    ]
  }
}
