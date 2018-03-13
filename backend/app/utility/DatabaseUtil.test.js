import mysql from 'mysql';

import databaseUtil from './DatabaseUtil';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('DatabaseUtil', () => {
    it('gets a connection', () => {
        databaseUtil.pool = {
            getConnection: jest.fn((callback) => {
                callback(undefined, 'some connection');
            }),
        };

        return databaseUtil.getConnection()
            .then((connection) => {
                expect(connection).toMatch('some connection');
            });
    });

    it('handles connection errors', () => {
        databaseUtil.pool = {
            getConnection: jest.fn((callback) => {
                callback(new Error('some error'));
            }),
        };

        return databaseUtil.getConnection()
            .catch((err) => {
                expect(err).toEqual(new Error('some error'));
            });
    });

    it('handles valid queries', () => {
        mysql.format = jest.fn();
        databaseUtil.getConnection = jest.fn().mockResolvedValue({
            query: jest.fn((query, callback) => {
                callback(undefined, 'some rows', 'some fields');
            }),
            release: jest.fn(),
        });

        return databaseUtil.sendQuery()
            .then((result) => {
                expect(result).toEqual({
                    rows: 'some rows',
                    fields: 'some fields',
                });
            });
    });

    it('handles database errors', () => {
        mysql.format = jest.fn();
        databaseUtil.getConnection = jest.fn().mockResolvedValue({
            query: jest.fn((query, callback) => {
                callback(new Error('some error'));
            }),
            release: jest.fn(),
        });

        return databaseUtil.sendQuery()
            .catch((err) => {
                expect(err).toEqual(new Error('some error'));
            });
    });

    it('ends the connection', () => {
        databaseUtil.pool.end = jest.fn();

        databaseUtil.end();
        expect(databaseUtil.pool.end).toHaveBeenCalledTimes(1);
    });
});
