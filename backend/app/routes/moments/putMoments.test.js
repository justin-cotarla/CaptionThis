import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import databaseUtil from '../../utility/DatabaseUtil';
import putMoments from './putMoments.js';

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
        description: 'test',
        file: {
            _data: 'test',
            hapi: {
                filename: 'test.jpg',
            },
        },
    },
};

const emptyAuthRequest = {
    auth: {},
    payload: {
        description: '',
        file: {
            _data: 'test',
            hapi: {
                filename: 'test.jpg',
            },
        },
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

const s3 = new AWS.S3();

describe('/api/moments endpoint', () => {
    it('successfully create a moment', () => {
        s3.upload = jest.fn(() => new Promise((resolve) => {
            resolve({
                data: {
                    Location: 'test.jpg',
                },
            });
        }));

        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));

        return putMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });

    it('Request with no authentication', () => {
        putMoments.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });

/*    it('request with no payload', () => {
        momentsRoute.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(3);
    }); */
});
