import databaseUtil from '../../utility/DatabaseUtil';
import getMoments from './getMoments.js';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    query: {
        limit: 1,
        'user-id': 1,
    },
};

const limitTestRequest = {
    query: [{
        'user-id': 1,
        limit: 20,
    }],
};

const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/getMoments endpoint', () => {
    it('Successfully get moments', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    MOMENT_ID: 1,
                    USER_ID: 1,
                    USERNAME: 'test',
                    IMG_URL: 'test',
                    DESCRIPTION: 'test',
                    DATE_ADDED: 1,
                    TOP_CAPTION: 'test',

                }],
                fields: {},
            });
        }));
        return getMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    moments: [{
                        moment_id: 1,
                        user: {
                            user_id: 1,
                            username: 'test',
                        },
                        img: 'test',
                        description: 'test',
                        date_added: 1,
                        top_caption: 'test',
                    }],
                });
            });
    });
    it('Test getMomentsBuilder', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    MOMENT_ID: 1,
                    USER_ID: 1,
                    USERNAME: 'test',
                    IMG_URL: 'test',
                    DESCRIPTION: 'test',
                    DATE_ADDED: 1,
                }],
                fields: {},
            });
        }));
        return getMoments.handler(limitTestRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    moments: [{
                        moment_id: 1,
                        user: {
                            user_id: 1,
                            username: 'test',
                        },
                        img: 'test',
                        description: 'test',
                        date_added: 1,
                        top_caption: 'Click to submit a caption',
                    }],
                });
            });
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
