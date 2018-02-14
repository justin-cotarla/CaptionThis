import databaseUtil from '../utility/DatabaseUtil';

const createCaption = {
    method: 'PUT',
    path: '/api/captions',
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }
        // Get the caption from request
        const { content } = request.payload;
        const userId = request.auth.credentials.user.id;
        const momentId = 1; // Placeholder moment ID

        // Check if the caption content is valid
        if (content === '') {
            return reply.response({ code: 2 }).code(400);
        }

        // Create db query
        const query = 'INSERT INTO CAPTION (CONTENT, USER_ID, MOMENT_ID) VALUES (?, ?, ?)';
        return databaseUtil
            .sendQuery(query, [content, userId, momentId])
            .then(() => reply.response({ code: 1 }).code(200))
            .catch((error) => {
                console.log(error);
                return reply.response({ code: 3 }).code(500);
            });
    },
};

export default [
    createCaption,
];
