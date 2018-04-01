import * as AuthUtil from '../../../utility/AuthUtil';
import DatabaseUtil from '../../../utility/DatabaseUtil';
import {
    INVALID_INPUT,
    GOOD,
    UNKNOWN_ERROR,
    USER_DOES_NOT_EXIST,
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

        const query = `
            SELECT
                DELETED
            FROM
                USER
            WHERE
                ID=?;
        `;

        return AuthUtil.validateToken(token)
            .then(({ username, id }) => Promise.all([
                DatabaseUtil.sendQuery(query, [id]),
                AuthUtil.generateToken({ username, id }),
            ]))
            .then(([result, newToken]) => {
                if (result.rows[0].DELETED === 1) {
                    throw USER_DOES_NOT_EXIST;
                }
                return reply
                    .response({ code: GOOD.code, newToken })
                    .code(GOOD.http);
            })
            .catch(error => (error.code ?
                reply.response({ code: error.code }).code(error.http) :
                reply.response({ code: UNKNOWN_ERROR.code }).code(UNKNOWN_ERROR.http)));
    },
};

export default postTokens;
