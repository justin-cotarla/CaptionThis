import databaseUtil from '../../utility/DatabaseUtil';
import deleteCaptions from './deleteCaptions.js';

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

const blankCaptionIdRequest = {
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

describe('/api/captions/:id Endpoint (Deleting)', () => {
    it('Handles successful deletion of a caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 1,
                }],
                fields: {},
            });
        }));
        return deleteCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Handles non-existent caption ID in the database', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return deleteCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles invalid user trying to delete caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 2,
                }],
                fields: {},
            });
        }));
        return deleteCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles request with blank authentication', () => {
        deleteCaptions.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
    it('Handles request with blank authentication', () => {
        deleteCaptions.handler(blankCaptionIdRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });
    it('Handles an unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return deleteCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
