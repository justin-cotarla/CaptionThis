import databaseUtil from '../../utility/DatabaseUtil';
import getMoments from './getMoments.js';

const request = {
    params: {
        momentid: 1,
    },
    query: {
        limit: 1,
    },
};

const badRequest = {
    params: {
        momentid: 1,
    },
    query: {
        limit: 'a',
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

/* const undefinedLimit = {
    params: {
        momentid: 1,
    },
    query: {
        limit
    },
}; */

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
                rows: [{}],
                fields: {},
            });
        }));
        return getMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Limit is non-integer', () => {
        getMoments.handler(badRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });
    it('Limit is empty string', () => {
        getMoments.handler(emptyLimit, reply);
        expect(emptyLimit.query.limit).toBe('');
    });
    /* it('Limit is undefined', () => {
        getMoments.handler(undefinedLimit, reply);
        expect(emptyLimit.query.limit).toBe(20);
    }); */
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
