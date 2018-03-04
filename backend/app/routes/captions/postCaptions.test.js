import databaseUtil from '../../utility/DatabaseUtil';
import postCaptions from './postCaptions.js';

// Requests for accepting/rejecting captions
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

// Requests for voting on captions
const voteRequest = {
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
        operation: 'vote',
        value: 1,
    },
};

const emptyVoteRequest = {
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
        operation: 'vote',
        value: undefined,
    },
};

// Common requests for both accepting/rejecting and voting on captions
const emptyAuthRequest = {
    auth: {},
    params: {
        id: 1,
    },
    payload: {
        operation: '',
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
        operation: '',
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

// Reply for testing accepting/rejecting captions. Also used for testing the general endpoint.
const selectionReply = {
    response: jest.fn(() => ({
        code: () => {},
    })),
};

// Reply for testing voting on captions.
const voteReply = {
    response: jest.fn(() => ({
        code: () => {},
        votes: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

// Test the generic functionality of the endpoint
describe('/api/captions/:id Endpoint (Common)', () => {
    it('Handles request with invalid or missing operation value', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(emptyOperationRequest, selectionReply)
            .then(() => {
                expect(selectionReply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles request with blank authentication', () => {
        postCaptions.handler(emptyAuthRequest, selectionReply);
        expect(selectionReply.response.mock.calls[0][0].code).toBe(4);
    });
    it('Handles request that is missing the caption ID', () => {
        postCaptions.handler(emptyIdRequest, selectionReply);
        expect(selectionReply.response.mock.calls[0][0].code).toBe(2);
    });
    it('Handles non-existent caption ID in the database', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return postCaptions.handler(selectionRequest, selectionReply)
            .then(() => {
                expect(selectionReply.response.mock.calls[0][0].code).toBe(2);
            });
    });
    it('Handles an unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return postCaptions.handler(selectionRequest, selectionReply)
            .then(() => {
                expect(selectionReply.response.mock.calls[0][0].code).toBe(3);
            });
    });
});

// Test the acceptance/rejection of a caption functionality
describe('/api/captions/:id Endpoint (Accepting/Rejecting)', () => {
    it('Handles successful acceptance or rejection of a caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(selectionRequest, selectionReply)
            .then(() => {
                expect(selectionReply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Handles request with invalid or missing selection value', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(emptySelectionRequest, selectionReply)
            .then(() => {
                expect(selectionReply.response.mock.calls[0][0].code).toBe(2);
            });
    });
});

// Test the caption voting captionality. Does not test for the vote count.
describe('/api/captions/:id Endpoint (Voting)', () => {
    it('Handles successful acceptance or rejection of a caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(voteRequest, voteReply)
            .then(() => {
                expect(voteReply.response.mock.calls[0][0].code).toBe(1);
            });
    });
    it('Handles request with invalid or missing vote value', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{}],
                fields: {},
            });
        }));
        return postCaptions.handler(emptyVoteRequest, voteReply)
            .then(() => {
                expect(voteReply.response.mock.calls[0][0].code).toBe(2);
            });
    });
});
