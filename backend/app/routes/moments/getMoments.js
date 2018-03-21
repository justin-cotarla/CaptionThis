import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const queryBuilder = (params) => {
    const conditions = [];
    const values = [];

    // To get captions by moment id, user-id, with a limit
    const userid = params['user-id'];
    let { limit, filter, order } = params;

    if (!(userid === undefined || userid === '' || userid === 0 || !/^\d+$/.test(userid))) {
        conditions.push('MOMENT.USER_ID=?');
        values.push(userid);
    }

    if (limit === undefined || limit === '' || !/^\d+$/.test(limit)) {
        limit = 20; // Default value for limit is 20
    }

    // Parse limit to number
    limit = parseInt(limit, 10);
    values.push(limit);

    switch (filter) {
    case 'popularity':
        filter = 'CAPTION_COUNT';
        break;
    default:
        filter = 'DATE_ADDED';
    }

    order = (order === 'asc')
        ? 'ASC'
        : 'DESC';

    return {
        where: conditions.length ? conditions[0] : 'TRUE',
        values,
        order: `${filter} ${order}`,
    };
};

const getMoments = {
    method: 'GET',
    path: '/api/moments',
    handler: (request, reply) => {
        const { where, values, order } = queryBuilder(request.query);

        // Caption Query
        const subQuery = `
        SELECT
            CONTENT
        FROM
            CAPTION
        LEFT JOIN
            CAPTION_VOTE TV
        ON
            TV.CAPTION_ID = CAPTION.ID
        WHERE
            MOMENT_ID=MOMENT.ID
        GROUP BY
            CONTENT
        ORDER BY
            COALESCE(SUM(TV.VALUE),0) DESC
        LIMIT 1
        `;

        // Create db query
        const query = `
        SELECT
            MOMENT.ID AS MOMENT_ID,
            IMG_URL,
            DESCRIPTION,
            MOMENT.DATE_ADDED,
            USER.USERNAME,
            USER.ID AS USER_ID,
            COUNT(C_CAPTION.ID) AS CAPTION_COUNT,
            (${subQuery}) AS TOP_CAPTION
        FROM
            MOMENT
        JOIN
            USER
        ON
            MOMENT.USER_ID = USER.ID
        LEFT JOIN
            CAPTION AS C_CAPTION
        ON
            C_CAPTION.MOMENT_ID = MOMENT.ID
        WHERE
            ${where}
        GROUP BY
            MOMENT.ID
        ORDER BY
            ${order}
        LIMIT ?
        `;

        return databaseUtil.sendQuery(query, values).then((result) => {
            const moments = result.rows.map(moment => ({
                moment_id: moment.MOMENT_ID,
                user: {
                    user_id: moment.USER_ID,
                    username: moment.USERNAME,
                },
                img: moment.IMG_URL,
                description: moment.DESCRIPTION,
                date_added: moment.DATE_ADDED,
                top_caption: moment.TOP_CAPTION ? moment.TOP_CAPTION : 'Click to submit a caption',
            }));

            // The response data includes a status code and the array of moments
            const data = {
                code: GOOD.code,
                moments,
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

export default getMoments;
