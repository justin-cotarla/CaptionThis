import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    INVALID_OPERATION,
    INVALID_USER_OPERATION,
    CAPTION_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const updateVote = (request, reply, captionId) => {
    // Get the user id and vote
    let userId = request.auth.credentials.user.id;
    let { value: vote } = request.payload;

    // Check if the vote is valid
    if (vote === undefined || vote === '' || !/^-*[01]$/.test(vote)) {
        return reply
            .response({ code: INVALID_INPUT.code })
            .code(INVALID_INPUT.http);
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
                code: GOOD.code,
                votes: voteCount,
            }).code(GOOD.http);
        });
};

const selectCaption = (request, reply, captionId) => {
    // Get the selection value
    let { value: selection } = request.payload;

    // Check if the selection is valid
    if (selection === undefined || selection === '' || !/^-*[01]$/.test(selection)) {
        return reply
            .response({ code: INVALID_INPUT.code })
            .code(INVALID_INPUT.http);
    }

    // Parse the selection to an integer
    selection = parseInt(selection, 10);

    const query = 'UPDATE CAPTION SET SELECTED=? WHERE ID=?';
    return databaseUtil.sendQuery(query, [selection, captionId])
        .then(() => reply
            .response({ code: GOOD.code })
            .code(GOOD.http));
};

const editCaption = (request, reply, captionId) => {
    // Get the edited caption
    const { value: editedCaption } = request.payload;

    // Check if it is valid
    if (!editedCaption) {
        return reply
            .response({ code: INVALID_INPUT.code })
            .code(INVALID_INPUT.http);
    }

    const query = 'UPDATE CAPTION SET CONTENT=? WHERE ID=?';
    return databaseUtil.sendQuery(query, [editedCaption, captionId])
        .then(() => reply
            .response({ code: GOOD.code })
            .code(GOOD.http));
};

const postCaptions = {
    method: 'POST',
    path: '/api/captions/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }

        // Get the caption id and operation
        let captionId = request.params.id;
        const { operation } = request.payload;

        // Check if the caption id is valid
        if (captionId === undefined || captionId === '' || !/^\d+$/.test(captionId)) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

        // Parse the caption id to an integer
        captionId = parseInt(captionId, 10);

        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=? AND DELETED=0';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                if (result.rows[0] === undefined) {
                    return reply
                        .response({ code: CAPTION_DOES_NOT_EXIST.code })
                        .code(CAPTION_DOES_NOT_EXIST.http);
                }

                switch (operation) {
                case 'vote': {
                    return updateVote(request, reply, captionId);
                }
                case 'select': {
                    return selectCaption(request, reply, captionId);
                }
                case 'edit': {
                    // A user should only be able to edit their own caption
                    if (result.rows[0].USER_ID !== request.auth.credentials.user.id) {
                        return reply
                            .response({ code: INVALID_USER_OPERATION.code })
                            .code(INVALID_USER_OPERATION.http);
                    }
                    return editCaption(request, reply, captionId);
                }
                default: {
                    return reply
                        .response({ code: INVALID_OPERATION.code })
                        .code(INVALID_OPERATION.http);
                }
                }
            })
            .catch(() => reply
                .response({ code: UNKNOWN_ERROR.code })
                .code(UNKNOWN_ERROR.http));
    },
};

export default postCaptions;
