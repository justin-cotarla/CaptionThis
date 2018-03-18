import databaseUtil from '../../utility/DatabaseUtil';
import putCaptions from './putCaptions.js';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
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
    payload: {
        content: 'test',
        moment_id: 1,
    },
};

const emptyCaptionRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    payload: {
        content: '',
        moment_id: 1,
    },
};

const emptyAuthRequest = {
    auth: {},
    payload: {
        content: 'test',
        moment_id: 1,
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

describe('/api/captions Endpoint', () => {
    it('Handles successful caption creation for a given moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return putCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });
    it('Handles unable to create caption due to empty content', () => {
        putCaptions.handler(emptyCaptionRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });
    it('Handles request with blank authentication', () => {
        putCaptions.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(UNAUTHORIZED.code);
    });
    it('Handles unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return putCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
