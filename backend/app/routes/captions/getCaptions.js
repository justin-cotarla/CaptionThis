import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

// Function to build the where clause for the getCaptions endpoint, and all values for the query
const getCaptionsBuilder = (params) => {
    const conditions = [];
    let order = 'SELECTED DESC, DATE_ADDED DESC';
    const values = [];

    // To get captions by moment id, user-id, with a limit
    const momentid = params['moment-id'];
    const captionsByUser = params['user-id'];
    const usedOrder = params['order'];

    let { limit } = params;

    if (!(momentid === undefined || momentid === '' || momentid === 0 || !/^\d+$/.test(momentid))) {
        conditions.push('MOMENT_ID=?');
        values.push(momentid);
    }

    if (usedOrder == 'total-votes') {
        order = 'TOTAL_VOTES DESC';
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
        order_values: order,
        values,
    };
};

const getCaptions = {
    method: 'GET',
    path: '/api/captions',
    handler: (request, reply) => {
        const { where, order_values, values } = getCaptionsBuilder(request.query);

        const userId = (request.auth.credentials)
            ? parseInt(request.auth.credentials.user.id, 10)
            : 'null';

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
            CAPTION.DATE_ADDED
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
            ${order_values}
        LIMIT ?
        `;

        const allQueryValues = [userId].concat(values);
        return databaseUtil.sendQuery(query, allQueryValues)
            .then((result) => {
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
                    code: GOOD.code,
                    captions,
                };

                // The request was successful
                return reply
                    .response(data)
                    .code(GOOD.http);
            })
            .catch((error) => {
                console.log(error);
                return reply
                    .response({ code: UNKNOWN_ERROR.code })
                    .code(UNKNOWN_ERROR.http);
            });
    },
};

export default getCaptions;
