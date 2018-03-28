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
                T.ID,
                USERNAME,
                T.DATE_ADDED,
                COUNT(DISTINCT MOMENT.ID) AS MOMENT_COUNT,
                COUNT(DISTINCT CAPTION.ID) AS CAPTION_COUNT,
                COUNT(DISTINCT CAPTION.ID, case SELECTED when 1 then 1 else null end) AS ACCEPT_COUNT,
                COUNT(DISTINCT CAPTION.ID, case SELECTED when -1 then 1 else null end) AS REJECT_COUNT,
                TOTAL_VOTE
            FROM
                (SELECT 
                    USER.ID,
                    USERNAME,
                    USER.DATE_ADDED,
                    SUM(CAPTION_VOTE.VALUE) AS TOTAL_VOTE
                FROM
                    USER
                JOIN
                    CAPTION_VOTE
                ON
                    USER.ID = CAPTION_VOTE.USER_ID
                GROUP BY USER.ID, USERNAME, USER.DATE_ADDED) AS T
            JOIN
                MOMENT
            ON
                T.ID = MOMENT.USER_ID
            JOIN
                CAPTION
            ON
                T.ID = CAPTION.USER_ID
            WHERE
                MOMENT.DELETED = 0 AND
                CAPTION.DELETED = 0 AND
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
                momentCount: result.rows[0].MOMENT_COUNT,
                captionCount: result.rows[0].CAPTION_COUNT,
                acceptCount: result.rows[0].ACCEPT_COUNT,
                rejectCount: result.rows[0].REJECT_COUNT,
                totalVote: result.rows[0].TOTAL_VOTE,
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
