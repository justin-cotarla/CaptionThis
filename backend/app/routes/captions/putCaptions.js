import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const putCaptions = {
    method: 'PUT',
    path: '/api/captions',
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }
        // Get the caption from request
        const { content, momentId } = request.payload;
        const userId = request.auth.credentials.user.id;

        // Check if the caption content is valid
        if (content === '') {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        // Create db query
        const query = 'INSERT INTO CAPTION (CONTENT, USER_ID, MOMENT_ID) VALUES (?, ?, ?)';
        return databaseUtil
            .sendQuery(query, [content, userId, momentId])
            .then(() => reply
                .response({ code: GOOD.code })
                .code(GOOD.http))
            .catch(() => reply
                .response({ code: UNKNOWN_ERROR.code })
                .code(UNKNOWN_ERROR.http));
    },
};

export default putCaptions;
