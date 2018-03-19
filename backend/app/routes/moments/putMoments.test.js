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
    payload: {},
};

const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/moments endpoint', () => {
    it('successfully create a moment', () => {
        AWS.S3 = () => ({
            upload: () => ({
                promise: jest.fn(() => Promise.resolve({
                    Location: 'test.jpg',
                })),
            }),
        });

        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));

        return putMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });

    it('Request with no authentication', () => {
        putMoments.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });

    it('Handle unknown error', () => {
        AWS.S3 = () => ({
            upload: () => ({
                promise: jest.fn(() => Promise.reject(new Error())),
            }),
        });

        return putMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});
