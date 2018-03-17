import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    CAPTION_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const deleteCaptions = {
    method: 'DELETE',
    path: '/api/captions/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }
        // Get the user id
        let userId = request.auth.credentials.user.id;

        // Get the caption id
        let captionId = request.params.id;

        // Check if the caption id is valid
        if (captionId === undefined || captionId === '' || !/^\d+$/.test(captionId)) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        // Parse the caption id to an integer
        userId = parseInt(userId, 10);
        captionId = parseInt(captionId, 10);

        // First check if the caption exists in the db
        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=? AND DELETED=0';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                // If the caption id is not in the db or it is already marked as deleted
                if (result.rows[0] === undefined) {
                    throw new Error('Caption ID does not exist');
                }
                // If user tries to delete another user's caption
                if (result.rows[0].USER_ID !== userId) {
                    throw new Error('Invalid user');
                }
                const deleteQuery = 'UPDATE CAPTION SET DELETED=1 WHERE ID=?';
                return databaseUtil.sendQuery(deleteQuery, [captionId]);
            })
            .then(() => reply
                .response({ code: GOOD.code })
                .code(GOOD.http))
            .catch((error) => {
                if (error.message === 'Caption ID does not exist' || error.message === 'Invalid user') {
                    return reply
                        .response({ code: CAPTION_DOES_NOT_EXIST.code })
                        .code(CAPTION_DOES_NOT_EXIST.http);
                }
                return reply
                    .response({ code: UNKNOWN_ERROR.code })
                    .code(UNKNOWN_ERROR.http);
            });
    },
};

export default deleteCaptions;
