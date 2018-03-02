import databaseUtil from '../utility/DatabaseUtil';

// Function to build the where clause for the getCaptions endpoint, and all values for the query
const getCaptionsBuilder = (params) => {
    const conditions = [];
    const values = [];

    // To get captions by moment id, user-id, with a limit
    const momentid = params['moment-id'];
    const captionsByUser = params['user-id'];
    let { limit } = params;

    if (!(momentid === undefined || momentid === '' || momentid === 0 || !/^\d+$/.test(momentid))) {
        conditions.push('MOMENT_ID=?');
        values.push(momentid);
    }

    if (!(captionsByUser === undefined || captionsByUser === '' || captionsByUser === 0 || !/^\d+$/.test(captionsByUser))) {
        conditions.push('CAPTION.USER_ID=?');
        values.push(captionsByUser);
    }

    if (limit === undefined || limit === '' || !/^\d+$/.test(limit)) {
        limit = 20; // Default value for limit is 20
    }

    // Parse limit to number
    limit = parseInt(limit, 10);
    values.push(limit);

    return {
        where: conditions.length ? conditions.join(' AND ') : 'TRUE',
        values,
    };
};

// ******Handlers for the updateCaption endpoint******
const updateVote = (request, reply, captionId) => {
    // Get the user id and vote
    let userId = request.auth.credentials.user.id;
    let { value: vote } = request.payload;

    // Check if the vote is valid
    if (vote === undefined || vote === '' || !/^-*[01]$/.test(vote)) {
        console.log('Invalid vote.');
        return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
    }

    // Parse the user id and vote to an integer
    userId = parseInt(userId, 10);
    vote = parseInt(vote, 10);

    const query = 'INSERT INTO CAPTION_VOTE (CAPTION_ID, USER_ID, VALUE) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE VALUE=?';
    return databaseUtil.sendQuery(query, [captionId, userId, vote, vote])
        .then(() => {
            const getVotes = 'SELECT SUM(VALUE) AS VOTECOUNT FROM CAPTION_VOTE WHERE CAPTION_ID=?';
            return databaseUtil.sendQuery(getVotes, [captionId]);
        })
        .then((result) => {
            const voteCount = result.rows[0].VOTECOUNT;
            return reply.response({
                code: 1,
                votes: voteCount,
            }).code(200);
        });
};

const selectCaption = (request, reply, captionId) => {
    // Get the selection value
    let { value: selection } = request.payload;

    // Check if the selection is valid
    if (selection === undefined || selection === '' || !/^-*[01]$/.test(selection)) {
        console.log('Invalid selection.');
        return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
    }

    // Parse the selection to an integer
    selection = parseInt(selection, 10);

    const query = 'UPDATE CAPTION SET SELECTED=? WHERE ID=?';
    return databaseUtil.sendQuery(query, [selection, captionId])
        .then(() => reply.response({ code: 1 }).code(200));
};

/* --------ENDPOINTS------- */

const createCaption = {
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
            .catch((error) => {
                console.log(error);
                return reply.response({ code: 3 }).code(500); // Code 3 means unknown error
            });
    },
};

const getCaptions = {
    method: 'GET',
    path: '/api/captions',
    handler: (request, reply) => {
        const { where, values } = getCaptionsBuilder(request.query);

        const userId = (request.auth.credentials)
            ? parseInt(request.auth.credentials.user.id, 10)
            : 'null';

        // To check if the moment exists
        const momentCheck = 'SELECT * FROM MOMENT WHERE ID=?';

        // The actual query
        const query = `
        SELECT
            MOMENT_ID,
            CAPTION.USER_ID AS USER_ID,
            USERNAME,
            CAPTION.ID AS CAPTION_ID,
            CONTENT,
            SELECTED,
            COALESCE(SUM(TV.VALUE),0) AS TOTAL_VOTES,
            COALESCE(UV.VALUE, 0) AS USER_VOTE,
            DATE_ADDED
        FROM
            CAPTION
        JOIN
            USER
        ON
            USER_ID = USER.ID
        LEFT JOIN
            CAPTION_VOTE TV
        ON
            TV.CAPTION_ID = CAPTION.ID
        LEFT JOIN
            CAPTION_VOTE UV
        ON
            UV.CAPTION_ID = CAPTION. ID AND UV.USER_ID = ?
        WHERE
            ${where}
        GROUP BY
            USER_ID,
            MOMENT_ID,
            CAPTION_ID,
            CONTENT,
            SELECTED,
            DATE_ADDED,
            USERNAME
        ORDER BY
            SELECTED DESC, DATE_ADDED DESC
        LIMIT ?
        `;

        return databaseUtil.sendQuery(momentCheck, [values[0]])
            .then((result) => {
                // For some reason, directly returning a reply here does not work
                if (result.rows.length === 0) {
                    throw new Error('Moment ID does not exist.');
                }

                const allQueryValues = [userId].concat(values);
                return databaseUtil.sendQuery(query, allQueryValues);
            })
            .then((result) => {
                console.log('now here here');
                const captions = result.rows.map(caption => ({
                    moment_id: caption.MOMENT_ID,
                    user: {
                        user_id: caption.USER_ID,
                        username: caption.USERNAME,
                    },
                    caption_id: caption.CAPTION_ID,
                    caption: caption.CONTENT,
                    selected: caption.SELECTED,
                    total_votes: caption.TOTAL_VOTES,
                    user_vote: caption.USER_VOTE,
                    date_added: caption.DATE_ADDED,
                }));

                // The response data includes a status code and the array of moments
                const data = {
                    code: 1,
                    captions,
                };

                // The request was successful
                return reply.response(data).code(200);
            })
            .catch((error) => {
                console.log(error);
                if (error.message === 'Moment ID does not exist.') {
                    return reply.response({ code: 2 }).code(400);
                }
                return reply.response({ code: 3 }).code(500);
            });
    },
};

const updateCaption = {
    method: 'POST',
    path: '/api/captions/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }

        // Get the caption id and operation
        let captionId = request.params.id;
        const { operation } = request.payload;

        // Check if the caption id is valid
        if (captionId === undefined || captionId === '' || !/^\d+$/.test(captionId)) {
            console.log('Invalid caption ID');
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Parse the caption id to an integer
        captionId = parseInt(captionId, 10);

        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=?';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                // If the caption id is not in the db, throw error
                if (result.rows[0] === undefined) {
                    throw new Error('Caption ID does not exist.');
                }
                switch (operation) {
                case 'vote': {
                    return updateVote(request, reply, captionId);
                }
                case 'select': {
                    return selectCaption(request, reply, captionId);
                }
                default: {
                    console.log('Invalid operation');
                    return reply.response({ code: 2 }).code(400);
                }
                }
            }).catch((error) => {
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
    getCaptions,
    updateCaption,
];
