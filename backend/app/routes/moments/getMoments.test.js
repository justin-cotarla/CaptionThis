import databaseUtil from '../../utility/DatabaseUtil';
import getMoments from './getMoments.js';

const request = {
    params: {
        momentid: 1,
        userid: 1,
        conditions: 1,
    },
    query: {
        limit: 1,
    },
};

const emptyLimit = {
    params: {
        momentid: 1,
    },
    query: {
        limit: '',
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
                }],
                fields: {},
            });
        }));
        return getMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: 1,
                    moments: [{
                        moment_id: 1,
                        user: {
                            user_id: 1,
                            username: 'test',
                        },
                        img: 'test',
                        description: 'test',
                        date_added: 1,
                    }],
                });
            });
    });
    it('User ID is pushed into values', () => {
        getMoments.handler(request, reply);
        expect(request.params.userid).toBe(1);
    });
    it('ID pushed into conditions', () => {
        getMoments.handler(request, reply);
        expect(request.params.userid).toBe(1);
    });
    it('Limit is empty string', () => {
        getMoments.handler(emptyLimit, reply);
        expect(emptyLimit.query.limit).toBe('');
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
