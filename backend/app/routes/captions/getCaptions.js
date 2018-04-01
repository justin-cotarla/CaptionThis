import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

// Function to build the where clause for the getCaptions endpoint, and all values for the query
const getCaptionsBuilder = (params) => {
    const conditions = [];
    const values = [];

    const momentid = params['moment-id'];
    const captionsByUser = params['user-id'];

    let {
        start,
        range,
        filter,
        order,
    } = params;

    conditions.push('CAPTION.DELETED=0');
    conditions.push('MOMENT.DELETED=0');

    if (!(momentid === undefined || momentid === '' || momentid === 0 || !/^\d+$/.test(momentid))) {
        conditions.push('MOMENT_ID=?');
        values.push(momentid);
    }

    switch (filter) {
    case 'votes':
        filter = 'TOTAL_VOTES';
        break;
    case 'acceptance':
        filter = 'SELECTED';
        break;
    default:
        filter = 'DATE_ADDED';
    }

    order = (order === 'asc')
        ? 'ASC'
        : 'DESC';

    if (!(captionsByUser === undefined || captionsByUser === '' || captionsByUser === 0 || !/^\d+$/.test(captionsByUser))) {
        conditions.push('CAPTION.USER_ID=?');
        values.push(captionsByUser);
    }

    if (start === undefined || start === '' || !/^\d+$/.test(start)) {
        start = 0; // Default value for start is 0
    }

    if (range === undefined || range === '' || !/^\d+$/.test(range)) {
        range = 20; // Default value for range is 20
    }

    start = parseInt(start, 10);
    values.push(start);

    range = parseInt(range, 10);
    values.push(range);

    return {
        where: conditions.join(' AND '),
        values,
        order: `${filter} ${order}`,
    };
};

const getCaptions = {
    method: 'GET',
    path: '/api/captions',
    handler: (request, reply) => {
        const { where, values, order } = getCaptionsBuilder(request.query);

        const userId = (request.auth.credentials)
            ? parseInt(request.auth.credentials.user.id, 10)
            : 'null';

        // The actual query
        const query = `
        SELECT
            MOMENT_ID,
            IF(USER.DELETED=0, CAPTION.USER_ID, null) AS USER_ID,
            IF(USER.DELETED=0, USERNAME, null) AS USERNAME,
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
        LEFT JOIN
            MOMENT
        ON
            MOMENT.ID = CAPTION.MOMENT_ID
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
            ${order}
        LIMIT ?, ?
        `;

        const allQueryValues = [userId].concat(values);
        return databaseUtil.sendQuery(query, allQueryValues)
            .then((result) => {
                const captions = result.rows.map(caption => ({
                    moment_id: caption.MOMENT_ID,
                    user: {
                        id: caption.USER_ID,
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
            .catch(() => reply
                .response({ code: UNKNOWN_ERROR.code })
                .code(UNKNOWN_ERROR.http));
    },
};

export default getCaptions;
