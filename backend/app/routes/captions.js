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
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Create db query
        const query = 'INSERT INTO CAPTION (CONTENT, USER_ID, MOMENT_ID) VALUES (?, ?, ?)';
        return databaseUtil
            .sendQuery(query, [content, userId, momentId])
            .then(() => reply.response({ code: 1 }).code(200)) // Code 1 means successful
            .catch((error) => {
                console.log(error);
                return reply.response({ code: 3 }).code(500); // Code 3 means unknown error
            });
    },
};

const getCaptionsByMoment = {
    method: 'GET',
    path: '/api/captions',
    handler: (request, reply) => {
        const momentid = request.query['moment-id'];
        let { limit } = request.query;

        // Check if moment id is valid
        if (momentid === undefined || momentid === '' || momentid === 0 || !/^\d+$/.test(momentid)) {
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        if (limit === undefined || limit === '') {
            limit = 20; // Default value for limit is 20
        } else if (!/^\d+$/.test(limit)) { // Test if string is only digits
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Parse limit to number to prep for db query
        limit = parseInt(limit, 10);

        // To check if the moment exists
        const check = 'SELECT * FROM MOMENT WHERE ID=?';

        // The actual query
        const query = `
            SELECT
                USER_ID,
                MOMENT_ID,
                CAPTION.ID AS CAPTION_ID,
                CONTENT,
                SELECTED,
                DATE_ADDED,
                USER.USERNAME FROM CAPTION
            JOIN
                USER
            ON
                USER_ID = USER.ID
            WHERE
                MOMENT_ID=?
            ORDER BY DATE_ADDED DESC
            LIMIT ?
        `;

        return databaseUtil.sendQuery(check, [momentid])
            .then((result) => {
                // If the length is 0, it does not exist
                if (result.rows.length === 0) {
                    return reply.response({ code: 2 }).code(404);
                }

                return databaseUtil.sendQuery(query, [momentid, limit]);
            })
            .then((result) => {
                const captions = result.rows.map(caption => ({
                    user: {
                        user_id: caption.USER_ID,
                        username: caption.USERNAME,
                    },
                    moment_id: caption.MOMENT_ID,
                    caption_id: caption.CAPTION_ID,
                    caption: caption.CONTENT,
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
                return reply.response({ code: 3 }).code(500);
            });
    },
};

const voteCaption = {
    method: 'POST',
    path: '/api/captions/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }

        // Get the caption id, user id, and vote
        let captionId = request.params.id;
        let userId = request.auth.credentials.user.id;
        let vote = request.payload.value;

        // Check if the caption id is valid
        if (captionId === undefined || captionId === '' || !/^\d+$/.test(captionId)) {
            console.log('Invalid caption ID');
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Check if the vote is valid
        if (vote === undefined || vote === '' || !/^-*[01]$/.test(vote)) {
            console.log('Invalid vote.');
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Parse the caption id to an integer
        captionId = parseInt(captionId, 10);
        userId = parseInt(userId, 10);
        vote = parseInt(vote, 10);

        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=?';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                // If the caption id is not in the db, throw error
                if (result.rows[0] === undefined) {
                    throw new Error('Caption ID does not exist.');
                }

                // If it exists, proceed with actual query to store caption vote
                const query = 'INSERT INTO CAPTION_VOTE (CAPTION_ID, USER_ID, VALUE) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE VALUE=?';
                return databaseUtil.sendQuery(query, [captionId, userId, vote, vote]);
            }).then(() => reply.response({ code: 1 }).code(200))
            .catch((error) => {
                console.log(error);
                if (error.message === 'Caption ID does not exist.') {
                    return reply.response({ code: 2 }).code(400);
                }
                return reply.response({ code: 3 }).code(300);
            });
    },
};

export default [
    createCaption,
    getCaptionsByMoment,
    voteCaption,
];
