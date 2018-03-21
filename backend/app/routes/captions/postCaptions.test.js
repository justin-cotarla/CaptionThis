import databaseUtil from '../../utility/DatabaseUtil';
import postCaptions from './postCaptions.js';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    INVALID_OPERATION,
    INVALID_USER_OPERATION,
    CAPTION_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

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

// Requests for editing captions
const editRequest = {
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
        operation: 'edit',
        value: 'test edit',
    },
};

const emptyEditRequest = {
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
        operation: 'edit',
        value: undefined,
    },
};

const wrongUserRequest = {
    auth: {
        credentials: {
            user: {
                id: 2,
                username: 'test',
            },
        },
    },
    params: {
        id: 1,
    },
    payload: {
        operation: 'edit',
        value: 'test edit',
    },
};

// Common requests for accepting/rejecting, voting on, and editing captions
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

const reply = {
    response: jest.fn(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

// Override the sendQuery
databaseUtil.sendQuery = jest.fn(query => new Promise((resolve) => {
    switch (query) {
    case 'SELECT SUM(VALUE) AS VOTECOUNT FROM CAPTION_VOTE WHERE CAPTION_ID=?':
        resolve({
            rows: [{ VOTECOUNT: 1 }],
            fields: {},
        });
        break;
    default:
        resolve({
            rows: [{}],
            fields: {},
        });
    }
}));

// Test the acceptance/rejection of a caption functionality
describe('/api/captions/:id Endpoint (Accepting/Rejecting)', () => {
    it('Handles successful acceptance or rejection of a caption', () =>
        postCaptions.handler(selectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            }));
    it('Handles request with invalid or missing selection value', () =>
        postCaptions.handler(emptySelectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
            }));
});

// Test the caption voting functionality
describe('/api/captions/:id Endpoint (Voting)', () => {
    it('Handles successful acceptance or rejection of a caption', () =>
        postCaptions.handler(voteRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({ code: GOOD.code, votes: 1 });
            }));
    it('Handles request with invalid or missing vote value', () =>
        postCaptions.handler(emptyVoteRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
            }));
});

// Test the caption editing functionality
describe('/api/captions/:id Endpoint (Editing)', () => {
    it('Handles successful editing of a caption', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    USER_ID: 1,
                }],
                fields: {},
            });
        }));
        return postCaptions.handler(editRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(GOOD.code);
            });
    });
    it('Handles request with invalid or missing edited caption', () =>
        postCaptions.handler(emptyEditRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
            }));
    it('Handles request where a wrong user attempts to edit caption', () =>
        postCaptions.handler(wrongUserRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_USER_OPERATION.code);
            }));
});

// Test the generic functionality of the endpoint
describe('/api/captions/:id Endpoint (Common)', () => {
    it('Handles request with invalid or missing operation value', () =>
        postCaptions.handler(emptyOperationRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(INVALID_OPERATION.code);
            }));
    it('Handles request with blank authentication', () => {
        postCaptions.handler(emptyAuthRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(UNAUTHORIZED.code);
    });
    it('Handles request that is missing the caption ID', () => {
        postCaptions.handler(emptyIdRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(INVALID_INPUT.code);
    });
    it('Handles non-existent caption ID in the database', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
        return postCaptions.handler(selectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(CAPTION_DOES_NOT_EXIST.code);
            });
    });
    it('Handles an unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return postCaptions.handler(selectionRequest, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(UNKNOWN_ERROR.code);
            });
    });
});
