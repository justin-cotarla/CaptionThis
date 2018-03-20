import AWS from 'aws-sdk';
import databaseUtil from '../../utility/DatabaseUtil';
import putMoments from './putMoments.js';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

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

const emptyFileRequest = {
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
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });

    it('Request with no authentication', () => {
        putMoments.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(UNAUTHORIZED.code);
    });

    it('Handles request with empty file upload', () => {
        putMoments.handler(emptyFileRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });

    it('Handle unknown error', () => {
        AWS.S3 = () => ({
            upload: () => ({
                promise: jest.fn(() => Promise.reject(new Error())),
            }),
        });

        return putMoments.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
