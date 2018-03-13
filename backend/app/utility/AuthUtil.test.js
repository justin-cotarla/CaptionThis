import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import databaseUtil from './DatabaseUtil';
import * as AuthUtil from './AuthUtil';

bcrypt.hash = jest.fn();

const username = 'test';
const password = 'qwerty';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('AuthUtil register', () => {
    it('registers new user', () => {
        databaseUtil.sendQuery = jest.fn().mockImplementationOnce(() => new Promise((resolve) => {
            resolve({
                rows: [],
                fields: [],
            });
        }))
            .mockImplementationOnce(() => new Promise((resolve) => {
                resolve({
                    rows: {
                        insertId: 1,
                    },
                    fields: [],
                });
            }));

        return AuthUtil.register(username, password)
            .then((result) => {
                expect(result).toEqual({ id: 1, username });
            });
    });

    it('handles attempts to register existing users', () => {
        databaseUtil.sendQuery = jest.fn().mockImplementationOnce(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    ID: 1,
                }],
                fields: [],
            });
        }));

        return AuthUtil.register(username, password)
            .catch((err) => {
                expect(err).toEqual(new Error('User exists'));
            });
    });
});

describe('AuthUtil authenticate', () => {
    it('authenticates existing user', () => {
        databaseUtil.sendQuery = jest.fn().mockImplementationOnce(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    ID: 1,
                    USERNAME: username,
                }],
                fields: [],
            });
        }));

        bcrypt.compare = jest.fn(() => true);

        return AuthUtil.authenticate(username, password)
            .then((result) => {
                expect(result).toEqual({ id: 1, username });
            });
    });

    it('rejects wrong credentials for existing users', () => {
        databaseUtil.sendQuery = jest.fn().mockImplementationOnce(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    ID: 1,
                    USERNAME: username,
                }],
                fields: [],
            });
        }));

        bcrypt.compare = jest.fn(() => false);

        return AuthUtil.authenticate(username, password)
            .catch((err) => {
                expect(err).toEqual(new Error('Wrong password'));
            });
    });

    it('handles innexistant users', () => {
        databaseUtil.sendQuery = jest.fn().mockImplementationOnce(() => new Promise((resolve) => {
            resolve({
                rows: [],
                fields: [],
            });
        }));

        return AuthUtil.authenticate(username, password)
            .catch((err) => {
                expect(err).toEqual(new Error('User does not exist'));
            });
    });
});

describe('AuthUtil token handling', () => {
    it('generates tokens', () => {
        jwt.sign = jest.fn((payload, key, params, callback) => {
            callback(undefined, 'some token');
        });

        return AuthUtil.generateToken()
            .then((result) => {
                expect(result).toMatch('some token');
            });
    });

    it('handles token generation errors', () => {
        jwt.sign = jest.fn((payload, key, params, callback) => {
            callback(new Error('some error'));
        });

        return AuthUtil.generateToken()
            .catch((err) => {
                expect(err).toEqual(new Error('some error'));
            });
    });

    it('validates tokens', () => {
        jwt.verify = jest.fn((payload, key, callback) => {
            callback(undefined, 'decoded');
        });

        return AuthUtil.validateToken()
            .then((result) => {
                expect(result).toMatch('decoded');
            });
    });

    it('handles token validation errors', () => {
        jwt.verify = jest.fn((payload, key, callback) => {
            callback(new Error('some error'));
        });

        return AuthUtil.validateToken()
            .catch((err) => {
                expect(err).toEqual(new Error('some error'));
            });
    });
});
