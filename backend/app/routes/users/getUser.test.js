import databaseUtil from '../../utility/DatabaseUtil';
import getUser from './getUser.js';

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
                }],
                fields: {},
            });
        }));
        return getUser.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: 1,
                    user: {
                        id: 1,
                        username: 'test',
                        dateAdded: '2011-11-11T11:11:11.000Z',
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
                expect(reply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getUser.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
