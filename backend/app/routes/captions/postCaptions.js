import databaseUtil from '../../utility/DatabaseUtil';

const updateVote = (request, reply, captionId) => {
    // Get the user id and vote
    let userId = request.auth.credentials.user.id;
    let { value: vote } = request.payload;

    // Check if the vote is valid
    if (vote === undefined || vote === '' || !/^-*[01]$/.test(vote)) {
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
        return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
    }

    // Parse the selection to an integer
    selection = parseInt(selection, 10);

    const query = 'UPDATE CAPTION SET SELECTED=? WHERE ID=?';
    return databaseUtil.sendQuery(query, [selection, captionId])
        .then(() => reply.response({ code: 1 }).code(200));
};


const postCaptions = {
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
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Parse the caption id to an integer
        captionId = parseInt(captionId, 10);

        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=?';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                if (result.rows[0] === undefined) {
                    return reply.response({ code: 2 }).code(400);
                }

                switch (operation) {
                case 'vote': {
                    return updateVote(request, reply, captionId);
                }
                case 'select': {
                    return selectCaption(request, reply, captionId);
                }
                default: {
                    return reply.response({ code: 2 }).code(400);
                }
                }
            })
            .catch(() => reply.response({ code: 3 }).code(300));
    },
};

export default postCaptions;
