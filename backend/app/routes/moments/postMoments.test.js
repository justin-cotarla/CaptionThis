import databaseUtil from '../../utility/DatabaseUtil';
import postMoments from './postMoments';
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
    payload: {
        description: 'test',
    },
};

const emptyAuthRequest = {
    auth: {},
    params: {
        id: 1,
    },
    payload: {
        description: 'test',
    },
};

const emptyIdRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {
        id: '',
    },
    payload: {
        description: 'test',
    },
};

const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('POST /api/moments/:id endpoint', () => {
    it('Handles successful edit of a moment description', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 1,
                }],
            });
        }));
        return postMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });

    it('Handles request with empty authentication', () => {
        postMoments.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(UNAUTHORIZED.code);
    });

    it('Handles case when moment with the specified id does not exist in database', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
            });
        }));
        return postMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(MOMENT_DOES_NOT_EXIST.code);
            });
    });

    it('Handles user trying to edit moment that they do not own', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 2,
                }],
            });
        }));
        return postMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_USER_OPERATION.code);
            });
    });

    it('Handles request with missing or invalid moment id', () => {
        postMoments.handler(emptyIdRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('Handles an unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return postMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
