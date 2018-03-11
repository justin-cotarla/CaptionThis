import databaseUtil from '../../utility/DatabaseUtil';

const getUser = {
    method: 'GET',
    path: '/api/users/{username}',
    handler: (request, reply) => {
        const query = `
            SELECT
                ID,
                USERNAME,
                DATE_ADDED
            FROM
                USER
            WHERE
                USERNAME = ?;
        `;

        return databaseUtil.sendQuery(query, [request.params.username]).then((result) => {
            if (!result.rows[0]) {
                return reply.response({ code: 2 }).code(404);
            }

            const user = {
                id: result.rows[0].ID,
                username: result.rows[0].USERNAME,
                dateAdded: result.rows[0].DATE_ADDED,
            };

            return reply.response({ user, code: 1 }).code(200);
        }).catch(() => reply.response({ code: 3 }).code(500));
    },
};

export default getUser;
