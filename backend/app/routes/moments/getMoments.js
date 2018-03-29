import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const queryBuilder = (params) => {
    const conditions = [];
    const values = [];

    const userid = params['user-id'];
    let {
        filter,
        order,
        range,
        start,
    } = params;

    conditions.push('MOMENT.DELETED=0');

    if (!(userid === undefined || userid === '' || userid === 0 || !/^\d+$/.test(userid))) {
        conditions.push('MOMENT.USER_ID=?');
        values.push(userid);
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
        where: conditions.join(' AND '),
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
            MOMENT_ID=MOMENT.ID AND
            CAPTION.DELETED=0
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
            IF(USER.DELETED=0, USERNAME, null) AS USERNAME,
            IF(USER.DELETED=0, USER.ID, null) AS USER_ID,
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
        LIMIT ?, ?
        `;

        return databaseUtil.sendQuery(query, values).then((result) => {
            const moments = result.rows.map(moment => ({
                moment_id: moment.MOMENT_ID,
                user: {
                    id: moment.USER_ID,
                    username: moment.USERNAME,
                },
                img: moment.IMG_URL,
                description: moment.DESCRIPTION,
                date_added: moment.DATE_ADDED,
                top_caption: moment.TOP_CAPTION ? moment.TOP_CAPTION : null,
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
            .catch(error => reply
                .response({ error, code: UNKNOWN_ERROR.code })
                .code(UNKNOWN_ERROR.http));
    },
};

export default getMoments;
