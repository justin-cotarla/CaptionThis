import * as AuthUtil from '../../utility/AuthUtil';
import registerRoute from './register';

// A dummy request
const request = {
    payload: {
      username: 'mahhass',
      password: 'mahhass',
    },
};

// A dummy empty request
const emptyRequest = {
  payload: {
    username: '',
    password: '',
  },
};
// A mock of Hapi's reply.response function
const reply = {
  response: jest.fn().mockImplementation(() => ({
    code: () => {},
  })),
};
// Mock the generateToken function
// The tests does not deal with token generation, so its implementation is ignore
AuthUtil.generateToken = jest.fn();
// clear mock history before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('api/auth/register endpoint', () => {
  // Mock the REGISTER function to INSERT { username: 'mahhass', password: 'mahehass' }
  it('Register a new user', () => {
    AuthUtil.register = jest.fn(() => new Promise((resolve)=> {
      resolve({
        id: 1,
        username: 'mahhass',
      });
    }));
    // The register route is exported from register.js in an array
    // .handler is the actual functon we are testing
    return registerRoute[0].handler(request, reply)
    .then(() => {
      // [0][0] refers to first function argument of the first call
      expect(reply.response.mock.calls[0][0].code).toBe(1);
    });
  });

  it('handles existing user with wrong password', () => {
    AuthUtil.register = jest.fn(() => new Promise(() => {
      throw new Error('Wrong password');
    }));
    return registerRoute[0].handler(request, reply)
    .then(() => {
      expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
  });

  it('handles users that do exist', () => {
    AuthUtil.register = jest.fn(() => new Promise(() => {
      throw new Error('User exists');
    }));
    return registerRoute[0].handler(request, reply)
    .then(() => {
      expect(reply.response.mock.calls[0][0].code).toBe(3);
    });
  });

  it('handles requests with blank params', () => {
    registerRoute[0].handler(emptyRequest, reply);
    expect(reply.response.mock.calls[0][0].code).toBe(2);
  });

  it('handles requests with missing payloads', () => {
    registerRoute[0].handler({}, reply);
    expect(reply.response.mock.calls[0][0].code).toBe(2);
  });

  it('handles unknown errors', () => {
    AuthUtil.register = jest.fn(() => new Promise(() => {
      throw new Error('idk man');
    }));
    return registerRoute[0].handler(request, reply)
    .then(() => {
      expect(reply.response.mock.calls[0][0].code).toBe(4);
    });
  });
});
