import databaseUtil from '../../utility/DatabaseUtil';

const putCaptions = {
    method: 'PUT',
    path: '/api/captions',
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }
        // Get the caption from request
        const { content, momentId } = request.payload;
        const userId = request.auth.credentials.user.id;

        // Check if the caption content is valid
        if (content === '') {
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Create db query
        const query = 'INSERT INTO CAPTION (CONTENT, USER_ID, MOMENT_ID) VALUES (?, ?, ?)';
        return databaseUtil
            .sendQuery(query, [content, userId, momentId])
            .then(() => reply.response({ code: 1 }).code(200)) // Code 1 means successful
            .catch(() => reply.response({ code: 3 }).code(500)); // Code 3 means unknown error
    },
};

export default putCaptions;
