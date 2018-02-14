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

const getCaptionsByMoment = {
    method: 'GET',
    path: '/api/captions',
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }
        console.log(request.query)
        let { momentid, limit } = request.query;

        // Check if moment id is valid
        if (momentid === undefined || momentid === '' || momentid == 0 || !/^\d+$/.test(momentid)) {
            return reply.response({ code: 2, moments: [] }).code(400); // Code 2 means invalid input
        }
        
        if (limit === undefined || limit === '') {
            limit = 20; // Default value for limit is 20
        } else if (!/^\d+$/.test(limit)) { // Test if string is only digits
            return reply.response({ code: 2, moments: [] }).code(400); // Code 2 means invalid input
        }

        // Parse limit to number to prep for db query
        limit = parseInt(limit, 10);

        let check = 'SELECT * FROM MOMENT WHERE ID=?'; // To check if the moment exists
        let query = 'SELECT * FROM CAPTION WHERE MOMENT_ID=? ORDER BY DATE_ADDED DESC LIMIT ?'; // The actual query
        return databaseUtil.sendQuery(check, [momentid]).then(result => {
            // If the length is 0, it does not exist
            if(result.rows.length === 0) {
                return reply.response({ code: 2 }).code(404);
            }
            return databaseUtil.sendQuery(query, [momentid, limit]).then((result) => {
                const captions = result.rows.map(caption => ({
                    user_id: caption.USER_ID,
                    moment_id: caption.MOMENT_ID,
                    caption_id: caption.ID,
                    caption: caption.CONTENT,
                    upvotes: caption.VOTE_COUNT,
                    selected: caption.SELECTED,
                    date_added: caption.DATE_ADDED,
                }));

                // The response data includes a status code and the array of moments
                const data = {
                    code: 1,
                    captions,
                };

                // The request was successful
                return reply.response(data).code(200);
            }).catch((error) => {
                console.log(error);
                return reply.response({ code: 3, captions: [] }).code(500); // Code 3 means unknown error
            });
        }).catch((error) => {
            console.log(error);
            return reply.response({ code: 3, captions: [] }).code(500);
        })
    }
}

export default [
    createCaption, getCaptionsByMoment
];
