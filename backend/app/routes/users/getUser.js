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
                USER.ID,
                USERNAME,
                USER.DATE_ADDED,
                COUNT(DISTINCT MOMENT.ID) AS MOMENT_COUNT,
                COUNT(DISTINCT CAPTION.ID) AS CAPTION_COUNT,
                COUNT(DISTINCT CAPTION.ID, case SELECTED when 1 then 1 else null end) AS ACCEPT_COUNT,
                COUNT(DISTINCT CAPTION.ID, case SELECTED when -1 then 1 else null end) AS REJECT_COUNT,
                TOTAL_VOTE
            FROM
                (SELECT 
                    USER.ID,
                    USER.DELETED,
                    USERNAME,
                    USER.DATE_ADDED,
                    SUM(CAPTION_VOTE.VALUE) AS TOTAL_VOTE
                FROM
                    USER
                LEFT JOIN
                    CAPTION
                ON
                    USER.ID = CAPTION.USER_ID
                LEFT JOIN
                    CAPTION_VOTE
                ON
                    CAPTION.ID = CAPTION_VOTE.CAPTION_ID
                WHERE CAPTION.DELETED=0
                GROUP BY USER.ID, USERNAME, USER.DATE_ADDED, USER.DELETED) AS USER
            LEFT JOIN
                (SELECT
                    MOMENT.USER_ID,
                    ID
                FROM
                    MOMENT
                WHERE
                    MOMENT.DELETED = 0) AS MOMENT
            ON
                USER.ID = MOMENT.USER_ID
            LEFT JOIN
                (SELECT
                    CAPTION.USER_ID,
                    CAPTION.ID,
                    SELECTED
                FROM
                    CAPTION
                JOIN
                    MOMENT
                ON
                    CAPTION.MOMENT_ID = MOMENT.ID
                WHERE
                    CAPTION.DELETED = 0 AND
                    MOMENT.DELETED = 0) AS CAPTION
            ON
                USER.ID = CAPTION.USER_ID
            WHERE
                USERNAME = 'justin' AND
                USER.DELETED=0
            GROUP BY ID, USERNAME, DATE_ADDED, TOTAL_VOTE;        
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
