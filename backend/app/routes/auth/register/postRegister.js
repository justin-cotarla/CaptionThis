import * as AuthUtil from '../../../utility/AuthUtil';
import {
    GOOD,
    INVALID_INPUT,
    UNKNOWN_ERROR,
    USER_EXISTS,
} from '../../../utility/ResponseCodes';

// Register user
const postRegister = {
    method: 'POST',
    path: '/api/auth/register',
    handler: (request, reply) => {
        if (!request.payload) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        const { username, password } = request.payload;

        if (username === undefined || username === ''
            || password === undefined || password === '') {
            // Invalid input
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        return AuthUtil.register(username, password)
            .then(user => AuthUtil.generateToken(user))
            .then(token => reply
                .response({ code: GOOD.code, token })
                .code(GOOD.http))
            .catch((err) => {
                if (err.message === 'User exists') {
                    // User exists
                    return reply
                        .response({ code: USER_EXISTS.code })
                        .code(USER_EXISTS.http);
                }
                // Unknown error
                return reply
                    .response({ code: UNKNOWN_ERROR.code })
                    .code(UNKNOWN_ERROR.http);
            });
    },
};

export default postRegister;
