import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import databaseUtil from './DatabaseUtil';
import { INVALID_TOKEN } from './ResponseCodes';

const SALT_ROUNDS = 10;

// Creates new user given credentials (defaults to regular user)
const register = (username, password) => new Promise((resolve, reject) => {
    const userQuery = `
        SELECT 
            ID
        FROM
            USER
        WHERE
            USERNAME = ?;
    `;

    const registerQuery = `
        INSERT INTO USER
        (USERNAME, HASH)
        VALUES
        (?, ?);
    `;

    // Check if user exists
    return databaseUtil.sendQuery(userQuery, [username])
        .then((result) => {
            if (result.rows.length !== 0) {
                throw new Error('User exists');
            }

            return bcrypt.hash(password, SALT_ROUNDS);
        })
        .then(hash => databaseUtil.sendQuery(registerQuery, [username, hash]))
        .then((result) => {
            resolve({
                id: result.rows.insertId,
                username,
            });
        })
        .catch((err) => {
            reject(err);
        });
});

// Returns user object given credentials
const authenticate = (username, password) => new Promise((resolve, reject) => {
    const query = `
        SELECT 
            ID, USERNAME, HASH
        FROM
            USER
        WHERE
            USERNAME = ? AND
            DELETED=0;
    `;

    let user;

    databaseUtil.sendQuery(query, [username])
        .then((result) => {
            if (result.rows.length === 0) {
                throw new Error('User does not exist');
            }

            user = {
                id: result.rows[0].ID,
                username: result.rows[0].USERNAME,
            };
            return bcrypt.compare(password, result.rows[0].HASH);
        })
        .then((match) => {
            if (match) {
                resolve(user);
            } else {
                throw new Error('Wrong password');
            }
        })
        .catch((err) => {
            reject(err);
        });
});

const generateToken = payload => new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1w' }, (err, token) => {
        if (err && err.message === 'invalid signature') {
            reject(INVALID_TOKEN);
        }
        resolve(token);
    });
});

const validateToken = token => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            reject(err);
        }
        resolve(decoded);
    });
});

export {
    validateToken,
    generateToken,
    authenticate,
    register,
};
