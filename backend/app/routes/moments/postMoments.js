import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    INVALID_USER_OPERATION,
    MOMENT_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const postMoments = {
    method: 'POST',
    path: '/api/moments/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }

        // Get moment id and edited description
        let momentId = request.params.id;
        const { description } = request.payload;

        // Check if the moment id and description are valid
        if (momentId === undefined || momentId === '' || !/^\d+$/.test(momentId) || !description) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        // Parse the moment id to an integer
        momentId = parseInt(momentId, 10);

        // Check to see if the moment exists in the database
        const checkMoment = 'SELECT * FROM MOMENT WHERE ID=? AND DELETED=0';
        return databaseUtil.sendQuery(checkMoment, [momentId])
            .then((result) => {
                // If the moment does not exist
                if (result.rows[0] === undefined) {
                    throw MOMENT_DOES_NOT_EXIST;
                }
                // If the user requesting the edit isn't the owner of the moment
                if (result.rows[0].USER_ID !== request.auth.credentials.user.id) {
                    throw INVALID_USER_OPERATION;
                }
                // Update the description of the moment
                const query = 'UPDATE MOMENT SET DESCRIPTION=? WHERE ID=?';
                return databaseUtil.sendQuery(query, [description, momentId]);
            })
            .then(() => reply
                .response({ code: GOOD.code })
                .code(GOOD.http))
            .catch(error =>
                ((error.code) ?
                    reply.response({ code: error.code }).code(error.http) :
                    reply.response({ code: UNKNOWN_ERROR.code }).code(UNKNOWN_ERROR.http)));
    },
};

export default postMoments;
