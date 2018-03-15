import databaseUtil from '../../utility/DatabaseUtil';

const deleteCaptions = {
    method: 'DELETE',
    path: '/api/captions/{id}',
    handler: (request, reply) => {
        // Check if authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }

        // Get the caption id
        let captionId = request.params.id;

        // Check if the caption id is valid
        if (captionId === undefined || captionId === '' || !/^\d+$/.test(captionId)) {
            return reply.response({ code: 2 }).code(400); // Code 2 means invalid input
        }

        // Parse the caption id to an integer
        captionId = parseInt(captionId, 10);

        // First check if the caption exists in the db
        const checkCaption = 'SELECT * FROM CAPTION WHERE ID=? AND DELETED=0';
        return databaseUtil.sendQuery(checkCaption, [captionId])
            .then((result) => {
                // If the caption id is not in the db or it is already marked as deleted
                if (result.rows[0] === undefined) {
                    return reply.response({ code: 2 }).code(400);
                }
                const deleteQuery = 'UPDATE CAPTION SET DELETED=1 WHERE ID=?';
                return databaseUtil.sendQuery(deleteQuery, [captionId]);
            })
            .then(() => reply.response({ code: 1 }).code(200))
            .catch(() => reply.response({ code: 3 }).code(300));
    },
};

export default deleteCaptions;
