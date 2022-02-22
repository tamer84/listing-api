# Kahula Collection Input API

API to save and update collection listings

## Setup

* Download [NodeJS 14 LTS](https://nodejs.org/en/)
* Install dependencies
```bash
npm install
```

## Build

This project uses npm `scripts` to build and package the project.  To view the scripts:

```bash
npm run
```

#### Build Artifact for AWS Lambda

```bash
npm run package
```
This produces a zipped file at this project's base directory: `collection-api.zip`

## Generate OpenAPI Documents

To generate openAPI documents, run the following file:

> openapi/openapi-generator.js

This will create the file: **openapi-listing.json**

~~The generated documentation has an issue with the vehicleCondition and vehicleType models, it adds a block "oneOf" which is unnecessary.
This should be manually removed before uploading to OneAPI.~~

## API Access

The listings API main point of contact is OneAPI. Internally this API is set as a Private API, thus it is only accesible within the same VPC (or through OneAPI). To access it within the VPC you can use the URL provided within terraform outputs (`private_url`),

However, given oneAPI limitiations (no access to test evironment, since testing envronment from oneAPI points to INT), it may be usefull to access the listings API though the VPN directly. This can be achieved, mostly to access Kahula TEST enviroment (but it works on any env), through [VPC Endoints](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-test-invoke-url.html). To use VPCE to access this API, you need VPN connection to the AWS environemnt and you can use the following url:

```
https://{vpce-url)/(stage-name)/{api-path}
```

The VPCE URL can be fetched from terraform outputs (`vpce_api_url`). Under this request you also need to add a `Header` with the API Gateway id for this api (also fetchable from terraform outputs).

On a practial example, we want to push a vehicle through the Listing API using the VPC-Endpoint:
- the stage is named live
- the api path is `/listings`

We then need to submit a POST through: 
```
https://vpce-02671ca15a52cd1d2-xr1hikzg.execute-api.eu-central-1.vpce.amazonaws.com/live/listings
```
with header `x-apigw-api-id` and key `<api-id>` (terraform output `api_id`). Finally we just need to add the proper body.

## Testing

### Integration Tests

******** Do NOT run against production *********

Scripts are found in: `test/_integration`

> Note: When running tests, you must set the required environment variables


### Unit Tests

This project uses [Jasmine](https://jasmine.github.io/) for unit testing.

#### Run Tests

```bash
yarn test
```

#### Run Individual Test

Filter by `describe` or `it`
```bash
jasmine **/*.test.js --filter="test_name"

## Useful Links

* https://stackoverflow.com/questions/60149391/how-to-use-jasmine-js-spy-on-a-required-function
