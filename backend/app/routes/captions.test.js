import databaseUtil from '../utility/DatabaseUtil';
import captionsRoute from './captions.js';

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
    it('Successfully creates a caption for a given moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return captionsRoute[0].handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Unable to create caption due to empty content', () => {
        captionsRoute[0].handler(emptyCaptionRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });
    it('Request with blank authentication', () => {
        captionsRoute[0].handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
    it('Unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return captionsRoute[0].handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
