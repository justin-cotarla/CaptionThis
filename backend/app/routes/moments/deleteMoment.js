import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    INVALID_USER_OPERATION,
    MOMENT_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const deleteMoment = {
    method: 'DELETE',
    path: '/api/moment/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }
        // Get the user id
        let userId = request.auth.credentials.user.id;

        // Get the moment id
        let momentId = request.params.id;

        // Check if the caption id is valid
        if (momentId === undefined || momentId === '' || !/^\d+$/.test(momentId)) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        // Parse the moment id to an integer
        userId = parseInt(userId, 10);
        momentId = parseInt(momentId, 10);

        // First check if the moment exists in the db
        const checkMoment = 'SELECT * FROM MOMENT WHERE MOMENT.ID=? AND DELETED=0';
        return databaseUtil.sendQuery(checkMoment, [momentId])
            .then((result) => {
                // If the caption id is not in the db or it is already marked as deleted
                if (result.rows[0] === undefined) {
                    throw new Error(MOMENT_DOES_NOT_EXIST);
                }
                // If user tries to delete another user's moment
                if (result.rows[0].USER_ID !== userId) { 
                    throw new Error(INVALID_USER_OPERATION);
                }
                const deleteQuery = 'UPDATE MOMENT SET DELETED=1 WHERE MOMENT.ID=?';
                return databaseUtil.sendQuery(deleteQuery, [momentId]);
            })
            .then(() => reply
                .response({ code: GOOD.code })
                .code(GOOD.http))
            .catch((error) => {

                return (error.message.code) ? reply.response({ code: error.message.code }).code(error.message.http)
                    : reply.response({ code: UNKNOWN_ERROR.code }).code(UNKNOWN_ERROR.http);
            });
    },
};

export default deleteMoment;
