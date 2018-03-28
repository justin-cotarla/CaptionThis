import databaseUtil from '../../utility/DatabaseUtil';
import getUser from './getUser.js';
import {
    GOOD,
    USER_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    params: {
        username: 'test',
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

describe('/api/getUser endpoint', () => {
    it('Successfully get a user', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    ID: 1,
                    USERNAME: 'test',
                    DATE_ADDED: '2011-11-11T11:11:11.000Z',
                    MOMENT_COUNT: 12,
                    CAPTION_COUNT: 22,
                    ACCEPT_COUNT: 3,
                    REJECT_COUNT: 5,
                    TOTAL_VOTE: 13,
                }],
                fields: {},
            });
        }));
        return getUser.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    user: {
                        id: 1,
                        username: 'test',
                        dateAdded: '2011-11-11T11:11:11.000Z',
                        momentCount: 12,
                        captionCount: 22,
                        acceptCount: 3,
                        rejectCount: 5,
                        totalVote: 13,
                    },
                });
            });
    });
    it('Handles innexistant users', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return getUser.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(USER_DOES_NOT_EXIST.code);
            });
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getUser.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
