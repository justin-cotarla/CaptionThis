import databaseUtil from '../../utility/DatabaseUtil';
import postCaptions from './postCaptions.js';

const selectionRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {
        id: 1,
    },
    payload: {
        operation: 'select',
        value: 1,
    },
};

const emptyAuthRequest = {
    auth: {},
    params: {
        id: 1,
    },
    payload: {
        operation: 'select',
        value: 1,
    },
};

const emptyIdRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {},
    payload: {
        operation: 'select',
        value: 1,
    },
};

const emptyOperationRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {
        id: 1,
    },
    payload: {
        operation: '',
        value: 1,
    },
};

const emptySelectionRequest = {
    auth: {
        credentials: {
            user: {
                id: 1,
                username: 'test',
            },
        },
    },
    params: {
        id: 1,
    },
    payload: {
        operation: 'select',
        value: undefined,
    },
};

const reply = {
    response: jest.fn(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/captions/:id Endpoint (Accepting/Rejecting)', () => {
    it('Handles successful acceptance or rejection of a caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(selectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Handles request with invalid or missing operation value', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(emptyOperationRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles request with invalid or missing selection value', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(emptySelectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles request with blank authentication', () => {
        postCaptions.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
    it('Handles request that is missing the caption ID', () => {
        postCaptions.handler(emptyIdRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(2);
    });
});
