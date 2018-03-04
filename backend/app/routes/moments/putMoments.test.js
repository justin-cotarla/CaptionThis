import AWS from 'aws-sdk';
import databaseUtil from '../../utility/DatabaseUtil';
import momentsRoute from './putMoments.js';


const request = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    payload: {
        description: '',
        file: {
            _data: 1,
            hapi: {
                filename: 'test.jpg',
            },
        },
    },
};

/* const emptyRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    payload: {
        output: '',
        parse: '',
        allow: '',
        maxBytes: 1,
    },
}; */

const emptyAuthRequest = {
    auth: {},
    payload: {
        output: '',
        parse: '',
        allow: '',
        maxBytes: 1,
    },
};

const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

const s3 = new AWS.S3({});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/moments endpoint', () => {
    it('successfully create a moment', () => {
        s3.mock = jest.fn(() => new Promise((resolve) => {
            resolve({
                data: {
                    ETag: '1"',
                    Location: 'test.jpg',
                    Key: '1',
                    Bucket: 'TestBucket',
                },
            });
        }));
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));

        return momentsRoute.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });

    it('request with no authentication', () => {
        momentsRoute.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });

/*    it('request with no payload', () => {
        momentsRoute.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(3);
    }); */
});
