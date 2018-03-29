import databaseUtil from '../../utility/DatabaseUtil';
import getMoments from './getMoments.js';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    query: {
        'user-id': 1,
    },
};

const queryBuildRequest = {
    query: {
        start: 1,
        range: 1,
        order: 'asc',
        filter: 'popularity',
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
                            id: 1,
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
    it('Test queryBuilder', () => {
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
        return getMoments.handler(queryBuildRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    moments: [{
                        moment_id: 1,
                        user: {
                            id: 1,
                            username: 'test',
                        },
                        img: 'test',
                        description: 'test',
                        date_added: 1,
                        top_caption: null,
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
