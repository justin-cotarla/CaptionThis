import databaseUtil from '../utility/DatabaseUtil';

const createCaption = {
    method: 'PUT',
    path: '/api/captions/',
    handler: (request, reply) => {
        // Get the caption from request
        const { content } = request.payload;
        const voteCount = 0; // Count of newly created caption is 0
        const selected = 0; // 0 for not seleted, 1 for selected
        const userId = 1; // Placeholder user ID
        const momentId = 1; // Placeholder moment ID

        // Check if the caption content is valid
        if (content === '') {
            return reply.response({ code: 2 }).code(400);
        }

        // Create db query
        const query = 'INSERT INTO CAPTION (CONTENT, VOTE_COUNT, SELECTED, USER_ID, MOMENT_ID) VALUES (?, ?, ?, ?, ?)';
        return databaseUtil
            .sendQuery(query, [content, voteCount, selected, userId, momentId])
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
