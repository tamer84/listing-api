# Input API

API to save and update listings

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
This produces a zipped file at this project's base directory: `listing-api.zip`

## Generate OpenAPI Documents

To generate openAPI documents, run the following file:

> openapi/openapi-generator.js

This will create the file: **openapi-listing.json**


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
