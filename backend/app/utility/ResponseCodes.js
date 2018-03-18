// General
const GOOD = {
    code: 1,
    http: 200,
};

const UNKNOWN_ERROR = {
    code: 99,
    http: 500,
};


// Auth
const UNAUTHORIZED = {
    code: 11,
    http: 401,
};

const WRONG_PASSWORD = {
    code: 12,
    http: 401,
};

const INVALID_TOKEN = {
    code: 13,
    http: 400,
};


// Request
const INVALID_INPUT = {
    code: 21,
    http: 400,
};

const INVALID_OPERATION = {
    code: 22,
    http: 400,
};


// Content
const INVALID_USER_OPERATION = {
    code: 31,
    http: 404,
};

const CAPTION_DOES_NOT_EXIST = {
    code: 32,
    http: 404,
};

const MOMENT_DOES_NOT_EXIST = {
    code: 33,
    http: 404,
};

const USER_DOES_NOT_EXIST = {
    code: 34,
    http: 404,
};

const USER_EXISTS = {
    code: 35,
    http: 409,
};


export {
    GOOD,
    UNKNOWN_ERROR,
    UNAUTHORIZED,
    WRONG_PASSWORD,
    INVALID_TOKEN,
    INVALID_INPUT,
    INVALID_OPERATION,
    INVALID_USER_OPERATION,
    CAPTION_DOES_NOT_EXIST,
    MOMENT_DOES_NOT_EXIST,
    USER_DOES_NOT_EXIST,
    USER_EXISTS,
};
