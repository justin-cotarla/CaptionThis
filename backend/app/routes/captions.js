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

const upvoteCaption = {
    method: 'POST',
    path: '/api/captions/{id}/{option}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply.response({
                code: 4,
                caption_id: 0,
                votes: 0,
            }).code(401);
        }
        // Get the caption id and parse it to an integer
        const captionId = parseInt(request.params.id, 10);

        // Check if the caption id is valid
        if (captionId === 0) {
            return reply.response({
                code: 2,
                caption_id: 0,
                votes: 0,
            });
        }
        // Create update query depending on the option parameter
        let updateQuery = '';
        if (request.params.option === 'upvote') {
            updateQuery = 'UPDATE CAPTION SET VOTE_COUNT=VOTE_COUNT+1 WHERE ID=?';
        } else if (request.params.option === 'downvote') {
            updateQuery = 'UPDATE CAPTION SET VOTE_COUNT=VOTE_COUNT-1 WHERE ID=?';
        }

        return databaseUtil.sendQuery(updateQuery, [captionId]).then(() => {
            // Get the updated vote count from db
            const query = 'SELECT VOTE_COUNT FROM CAPTION WHERE ID=?';
            return databaseUtil.sendQuery(query, [captionId]).then((result) => {
                const data = {
                    code: 1,
                    caption_id: captionId,
                    votes: result.rows[0].VOTE_COUNT,
                };
                return reply.response(data).code(200);
            });
        }).catch((error) => {
            console.log(error);
            return reply.response({
                code: 3,
                caption_id: captionId,
                votes: 0,
            });
        });
    },
};

export default [
    createCaption,
    upvoteCaption,
    getCaptionsByMoment,
];
