import databaseUtil from '../../utility/DatabaseUtil';
import getMoment from './getMoment.js';

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
                    ID: 1,
                    IMG_URL: 'test',
                    DESCRIPTION: 'testDescription',
                    DATA_ADDED: 0,
                    USER_ID: 1,
                }],
                fields: {},
            });
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
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
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(4);
            });
    });
});
