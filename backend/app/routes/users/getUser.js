import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    USER_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

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
                return reply
                    .response({ code: USER_DOES_NOT_EXIST.code })
                    .code(USER_DOES_NOT_EXIST.http);
            }

            const user = {
                id: result.rows[0].ID,
                username: result.rows[0].USERNAME,
                dateAdded: result.rows[0].DATE_ADDED,
            };

            return reply
                .response({ user, code: GOOD.code })
                .code(GOOD.http);
        }).catch(() => reply
            .response({ code: UNKNOWN_ERROR.code })
            .code(UNKNOWN_ERROR.http));
    },
};

export default getUser;
