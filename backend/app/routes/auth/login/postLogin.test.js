import * as AuthUtil from '../../../utility/AuthUtil';
import postLogin from './postLogin';

// A dummy request
const request = {
    payload: {
        username: 'test',
        password: 'test',
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
// The tests does not deal with token generation, so its implementation is ignored
AuthUtil.generateToken = jest.fn();

// clear mock history before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe('api/auth/login endpoint', () => {
    it('logs in existing user', () => {
        // Mock the authenticate function to return { id:1, username: 'test' }
        AuthUtil.authenticate = jest.fn(() => new Promise((resolve) => {
            resolve({
                id: 1,
                username: 'test',
            });
        }));

        // The login route is exported from login.js in an array
        // .handler is the actual functon we are testing
        return postLogin.handler(request, reply)
            .then(() => {
                // [0][0] refers to first function argument of the first call
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });

    it('handles existing user with wrong password', () => {
        AuthUtil.authenticate = jest.fn(() => new Promise(() => {
            throw new Error('Wrong password');
        }));

        return postLogin.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(4);
            });
    });

    it('handles users that do not exist', () => {
        AuthUtil.authenticate = jest.fn(() => new Promise(() => {
            throw new Error('User does not exist');
        }));

        return postLogin.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });

    it('handles requests with blank params', () => {
        postLogin.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });

    it('handles requests with missing payloads', () => {
        postLogin.handler({}, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });

    it('handles unknown errors', () => {
        AuthUtil.authenticate = jest.fn(() => new Promise(() => {
            throw new Error('idk man');
        }));

        return postLogin.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(5);
            });
    });
});

