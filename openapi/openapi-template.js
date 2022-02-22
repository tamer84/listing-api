module.exports = {
    "openapi": "3.0.2",
    "info": {
        "title": "Kahula Input API",
        "description": "API for publishing collection listings",
        "termsOfService": "",
        "contact": {"email": "@mercedes-benz.io"},
        "license": {"name": "UNLICENSED", "url": ""},
        "version": "1.0.0"
    },
    "servers": [{
        "url": "https://api.int.kahula.mercedes-benz.io/mgw/dealer"
    }],
    "tags": [
        { "name": "Kahula", "description": "Commerce Product Supply (Kahula)" }
    ],
    "paths": {
        "/listings": {
            "post": {
                "tags": ["Listing"],
                "summary": "Create a listing",
                "description": "Create a new collection stock listing",
                "operationId": "createListing",
                "requestBody": {
                    "description": "collection stock listing",
                    "content": {
                        "application/json": {"schema": {"$ref": "#/components/schemas/Listing"}},
                    },
                    "required": true
                },
                "responses": {
                    "201": {
                        "description": "Successful operation",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiResponse"}}
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "409": {
                        "description": "Conflict",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "500": {
                        "description": "Internal error",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    }
                },
                "security": [{"api_key": []}]
            }
        },
        "/listings/{id}": {
            "put": {
                "tags": ["Listing"],
                "summary": "Update a listing",
                "description": "Update a a collection stock listing",
                "operationId": "updateListing",
                "parameters": [{
                    "name": "id",
                    "in": "path",
                    "description": "Kahula product identifier",
                    "required": true,
                    "schema": {"type": "string", "format": "uuid"}
                }],
                "requestBody": {
                    "description": "Update an existent listing",
                    "content": {
                        "application/json": {"schema": {"$ref": "#/components/schemas/Listing"}},
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful operation",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiResponse"}}
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "404": {
                        "description": "Listing not found",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "500": {
                        "description": "Internal error",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    }
                },
                "security": [{"api_key": []}]
            }
        },
        "/listings/{id}/availability": {
            "put": {
                "tags": ["Availability"],
                "summary": "Update a listing availability",
                "description": "Update a collection listing stock availability",
                "operationId": "updateAvailability",
                "parameters": [{
                    "name": "id",
                    "in": "path",
                    "description": "Kahula product identifier",
                    "required": true,
                    "schema": {"type": "string", "format": "uuid"}
                }],
                "requestBody": {
                    "description": "Update a collection listing stock availability",
                    "content": {
                        "application/json": {"schema": {"$ref": "#/components/schemas/Availability"}},
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful operation",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiResponse"}}
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "404": {
                        "description": "Listing not found",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    },
                    "500": {
                        "description": "Internal error",
                        "content": {
                            "application/json": {"schema": {"$ref": "#/components/schemas/ApiError"}}
                        }
                    }
                },
                "security": [{"api_key": []}]
            }
        }
    },
    "components": {
        "schemas": {
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "reqId": {"type": "string", "format": "uuid"},
                    "productId": {"type": "string", "format": "uuid"},
                    "message": {"type": "string"}
                }
            },
            "ApiError": {
                "type": "object",
                "properties": {
                    "reqId": {"type": "string", "format": "uuid"},
                    "code": {"type": "number", "format": "int32"},
                    "message": {"type": "string"},
                    "errors": { "type": "array", "items": { "type": "string" } }
                }
            }
        },
        "requestBodies": {
            "Listing": {
                "description": "Listing object that is created or updated",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/Listing"}}
                }
            },
            "Availability": {
                "description": "Availability object to update a Listing availability",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/Availability"}}
                }
            }
        },
        "securitySchemes": {
            "api_key": {"type": "apiKey", "name": "x-api-key", "in": "header"}
        }
    }
}
