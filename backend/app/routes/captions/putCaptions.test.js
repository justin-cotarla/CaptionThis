import databaseUtil from '../../utility/DatabaseUtil';
import putCaptions from './putCaptions.js';

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
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Handles unable to create caption due to empty content', () => {
        putCaptions.handler(emptyCaptionRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });
    it('Handles request with blank authentication', () => {
        putCaptions.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
    it('Handles unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return putCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
