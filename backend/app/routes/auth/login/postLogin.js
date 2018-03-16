import * as AuthUtil from '../../../utility/AuthUtil';
import {
    GOOD,
    INVALID_INPUT,
    USER_DOES_NOT_EXIST,
    WRONG_PASSWORD,
    UNKNOWN_ERROR,
} from '../../../utility/ResponseCodes';

const postLogin = {
    method: 'POST',
    path: '/api/auth/login',
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

        return AuthUtil.authenticate(username, password)
            .then(user => AuthUtil.generateToken(user))
            .then(token => reply
                .response({ code: GOOD.code, token })
                .code(GOOD.http))
            .catch((err) => {
                switch (err.message) {
                case 'User does not exist':
                    return reply
                        .response({ code: USER_DOES_NOT_EXIST.code })
                        .code(USER_DOES_NOT_EXIST.http);
                case 'Wrong password':
                    return reply
                        .response({ code: WRONG_PASSWORD.code })
                        .code(WRONG_PASSWORD.http);
                default:
                    return reply
                        .response({ code: UNKNOWN_ERROR.code })
                        .code(UNKNOWN_ERROR.http);
                }
            });
    },
};

export default postLogin;
