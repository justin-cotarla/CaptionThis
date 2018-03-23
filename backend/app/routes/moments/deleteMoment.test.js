import databaseUtil from '../../utility/DatabaseUtil';
import deleteMoment from './deleteMoment.js';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    INVALID_USER_OPERATION,
    MOMENT_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {
        id: 1,
    },
};

const blankMomentIdRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {},
};

const emptyAuthRequest = {
    auth: {},
    params: {
        id: 1,
    },
};

const reply = {
    response: jest.fn(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/moment/:id Endpoint (Deleting)', () => {
    it('Handles successful deletion of a moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 1,
                }],
                fields: {},
            });
        }));
        return deleteMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });
    it('Handles non-existent moment ID in the database', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return deleteMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(MOMENT_DOES_NOT_EXIST.code);
            });
    });
    it('Handles invalid user trying to delete moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 2,
                }],
                fields: {},
            });
        }));
        return deleteMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_USER_OPERATION.code);
            });
    });
    it('Handles request with blank authentication', () => {
        deleteMoment.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(UNAUTHORIZED.code);
    });
    it('Handles request with invalid moment ID', () => {
        deleteMoment.handler(blankMomentIdRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });
    it('Handles an unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return deleteMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
