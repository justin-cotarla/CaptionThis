import databaseUtil from '../../utility/DatabaseUtil';
import getMoment from './getMoment.js';
import {
    GOOD,
    MOMENT_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const request = {
    params: {
        momentid: 1,
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
    it('Successfully get a moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    MOMENT_ID: 1,
                    IMG_URL: 'test',
                    DESCRIPTION: 'test',
                    DATE_ADDED: 1,
                    USER_ID: 1,
                    USERNAME: 'test',
                }],
                fields: {},
            });
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: GOOD.code,
                    moment: {
                        moment_id: 1,
                        img_url: 'test',
                        description: 'test',
                        date_added: 1,
                        user: {
                            username: 'test',
                            id: 1,
                        },
                    },
                });
            });
    });
    it('Nothing is returned', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(MOMENT_DOES_NOT_EXIST.code);
            });
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
