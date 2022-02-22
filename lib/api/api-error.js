'use strict';

module.exports = class ApiError extends Error {

    constructor({id, code, msg, errors}) {
        super(msg || 'Internal Server Error');
        this.name = 'ApiError';
        this.id = id;
        this.code = code || 500;
        this.msg = msg;
        this.errors = (Array.isArray(errors) ? errors : [errors]).filter(a => !! a);
    }

    /**
     * This method is used to serialize the Error into JSON for the API response
     * @returns {{message, reqId, errors: (*|null)}}
     */
    toJSON() {
        return {
            reqId: this.id,
            code: this.code,
            message: this.msg,
            errors: this.errors
        };
    }

    static conflict(id, errors) {
        return new ApiError({id, code: 409, msg: 'Conflict', errors});
    }
    static internalError(id, msg = 'Internal server error') {
        return new ApiError({id, code: 500, msg })
    }
    static badRequest(id, errors) {
        return new ApiError({id, code: 400, msg: 'Bad request', errors});
    }
    static notFound(id, errors) {
        return new ApiError({id, code: 404, msg: 'Not found', errors});
    }
}

