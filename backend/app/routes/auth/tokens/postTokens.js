import * as AuthUtil from '../../../utility/AuthUtil';
import {
    INVALID_INPUT,
    GOOD,
    INVALID_TOKEN,
    UNKNOWN_ERROR,
} from '../../../utility/ResponseCodes';

const postTokens = {
    method: 'POST',
    path: '/api/auth/tokens',
    handler: (request, reply) => {
        if (!request.payload) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        const { token } = request.payload;

        if (token === undefined || token === '') {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        return AuthUtil.validateToken(token)
            .then(({ id, username }) => AuthUtil.generateToken({ id, username }))
            .then(newToken => reply
                .response({ code: GOOD.code, newToken })
                .code(GOOD.http))
            .catch((err) => {
                if (err.message === 'invalid signature') {
                    return reply
                        .response({ code: INVALID_TOKEN.code })
                        .code(INVALID_TOKEN.http);
                }
                return reply
                    .response({ code: UNKNOWN_ERROR.code })
                    .code(UNKNOWN_ERROR.http);
            });
    },
};

export default postTokens;

