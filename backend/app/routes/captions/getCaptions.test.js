import databaseUtil from '../../utility/DatabaseUtil';
import getCaptions from './getCaptions.js';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    auth: {
        credentials: {
            user: {
                id: 1,
            },
        },
    },
    query: {
        'moment-id': 1,
        'user-id': 1,
        order: 'total-votes',
        limit: 1,
    },
};

const emptyRequest = {
    auth: {},
    query: {},
};

const reply = {
    response: jest.fn(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/captions GET Endpoint', () => {
    it('Handles successful retrieval of captions', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    MOMENT_ID: 1,
                    USER_ID: 1,
                    USERNAME: 'TEST',
                    CAPTION_ID: 1,
                    CONTENT: 'TEST',
                    SELECTED: 0,
                    TOTAL_VOTES: 1,
                    USER_VOTE: 1,
                    DATE_ADDED: '2018-02-15 20:07:04',
                }],
            });
        }));
        return getCaptions.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    captions: [{
                        moment_id: 1,
                        user: {
                            user_id: 1,
                            username: 'TEST',
                        },
                        caption_id: 1,
                        caption: 'TEST',
                        selected: 0,
                        total_votes: 1,
                        user_vote: 1,
                        date_added: '2018-02-15 20:07:04',
                    }],
                });
            });
    });
    it('Handles request missing authentication and query', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getCaptions.handler(emptyRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
