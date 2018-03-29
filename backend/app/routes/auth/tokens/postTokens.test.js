
import * as AuthUtil from '../../../utility/AuthUtil';
import DatabaseUtil from '../../../utility/DatabaseUtil';
import postTokens from './postTokens';
import {
    INVALID_INPUT,
    GOOD,
    INVALID_TOKEN,
    UNKNOWN_ERROR,
    USER_DOES_NOT_EXIST,
} from '../../../utility/ResponseCodes';

// A dummy request
const request = {
    payload: {
        token: 'test',
    },
};

// A dummy empty request
const emptyRequest = {
    payload: {
        token: '',
    },
};

// A mock of Hapi's reply.response function
const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

// Mock the generateToken function
// The tests does not deal with token generation, so its implementation is ignored
AuthUtil.generateToken = jest.fn();

// clear mock history before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe('api/auth/tokens endpoint', () => {
    it('handles token validation', () => {
        DatabaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    DELETED: 1,
                }],
                fields: {},
            });
        }));

        AuthUtil.validateToken = jest.fn(() => new Promise((resolve) => {
            resolve({
                id: 1,
                username: 'test',
            });
        }));

        return postTokens.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: USER_DOES_NOT_EXIST.code,
                });
            });
    });

    it('handles token validation', () => {
        DatabaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    DELETED: 0,
                }],
                fields: {},
            });
        }));

        AuthUtil.validateToken = jest.fn(() => new Promise((resolve) => {
            resolve({
                id: 1,
                username: 'test',
            });
        }));

        AuthUtil.generateToken = jest.fn(() => new Promise((resolve) => {
            resolve('token');
        }));

        return postTokens.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    newToken: 'token',
                });
            });
    });

    it('handles requests with missing payloads', () => {
        postTokens.handler({}, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('handles token requests with missing params', () => {
        postTokens.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('handles invalid tokens', () => {
        AuthUtil.validateToken = jest.fn(() => new Promise(() => {
            throw INVALID_TOKEN;
        }));

        return postTokens.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_TOKEN.code);
            });
    });

    it('handles unknown errors', () => {
        AuthUtil.validateToken = jest.fn(() => new Promise(() => {
            throw new Error('idk man');
        }));

        return postTokens.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
