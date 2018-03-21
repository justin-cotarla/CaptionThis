import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    MOMENT_DOES_NOT_EXIST,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const getMoment = {
    method: 'GET',
    path: '/api/moments/{momentid}',
    handler: (request, reply) => {
        // Get limit query param, Hapi parses params as strings

        const id = parseInt(request.params.momentid, 10);

        // Create db query
        const query = `
        SELECT
            MOMENT.ID AS MOMENT_ID,
            IMG_URL,
            DESCRIPTION,
            MOMENT.DATE_ADDED,
            USER.USERNAME,
            USER.ID AS USER_ID
        FROM
            MOMENT
        JOIN
            USER
        ON
            MOMENT.USER_ID = USER.ID
        WHERE
            MOMENT.ID=?
        `;
        return databaseUtil.sendQuery(query, [id]).then((result) => {
            if (!result.rows[0]) {
                return reply
                    .response({ code: MOMENT_DOES_NOT_EXIST.code })
                    .code(MOMENT_DOES_NOT_EXIST.http);
            }

            const moment = {
                moment_id: result.rows[0].ID,
                img_url: result.rows[0].IMG_URL,
                description: result.rows[0].DESCRIPTION,
                date_added: result.rows[0].DATE_ADDED,
                user: {
                    username: result.rows[0].USERNAME,
                    user_id: result.rows[0].USER_ID,
                },
            };

            // The response data includes a status code and the moment
            const data = {
                code: GOOD.code,
                moment,
            };

            // The request was successful
            return reply.response(data).code(GOOD.http);
        }).catch(() => reply
            .response({ code: UNKNOWN_ERROR.code })
            .code(UNKNOWN_ERROR.http));
    },
};

export default getMoment;
