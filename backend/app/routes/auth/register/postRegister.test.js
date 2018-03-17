import * as AuthUtil from '../../../utility/AuthUtil';
import postRegister from './postRegister';
import {
    GOOD,
    INVALID_INPUT,
    UNKNOWN_ERROR,
    USER_EXISTS,
} from '../../../utility/ResponseCodes';

// A dummy request
const request = {
    payload: {
        username: 'mahhass',
        password: 'mahhass',
    },
};

// A dummy empty request
const emptyRequest = {
    payload: {
        username: '',
        password: '',
    },
};
// A mock of Hapi's reply.response function
const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};
// Mock the generateToken function
// The tests does not deal with token generation, so its implementation is ignore
AuthUtil.generateToken = jest.fn();
// clear mock history before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe('api/auth/register endpoint', () => {
    // Mock the REGISTER function to INSERT { username: 'mahhass', password: 'mahehass' }
    it('Register a new user', () => {
        AuthUtil.register = jest.fn(() => new Promise((resolve) => {
            resolve({
                id: 1,
                username: 'mahhass',
            });
        }));
        // The register route is exported from register.js in an array
        // .handler is the actual functon we are testing
        return postRegister.handler(request, reply)
            .then(() => {
                // [0][0] refers to first function argument of the first call
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });

    it('handles users that do exist', () => {
        AuthUtil.register = jest.fn(() => new Promise(() => {
            throw new Error('User exists');
        }));
        return postRegister.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(USER_EXISTS.code);
            });
    });

    it('handles requests with blank params', () => {
        postRegister.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('handles requests with missing payloads', () => {
        postRegister.handler({}, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('handles unknown errors', () => {
        AuthUtil.register = jest.fn(() => new Promise(() => {
            throw new Error('idk man');
        }));
        return postRegister.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
