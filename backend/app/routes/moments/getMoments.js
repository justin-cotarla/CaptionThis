import databaseUtil from '../../utility/DatabaseUtil';

const getMomentsBuilder = (params) => {
    const conditions = [];
    const values = [];

    // To get captions by moment id, user-id, with a limit
    const userid = params['user-id'];
    let { limit } = params;

    if (!(userid === undefined || userid === '' || userid === 0 || !/^\d+$/.test(userid))) {
        conditions.push('MOMENT.USER_ID=?');
        values.push(momentid);
    }

    if (limit === undefined || limit === '' || !/^\d+$/.test(limit)) {
        limit = 15; // Default value for limit is 15
    }

    // Parse limit to number
    limit = parseInt(limit, 10);
    values.push(limit);

    return {
        where: conditions ? conditions[0] : 'TRUE',
        values,
    };
};

const getMoments = {
    method: 'GET',
    path: '/api/moments',
    handler: (request, reply) => {
        // Get limit query param, Hapi parses params as strings
        let { limit } = request.query;
        // If param is absent, it is undefined. If present but not specified, it is the empty string
        if (limit === undefined || limit === '') {
            limit = 20; // Default value for limit is 20
        } 
        
        const { where, values } = getMomentsBuilder(request.query);

        // Create db query
        const query = `
        SELECT 
            MOMENT.ID AS MOMENT_ID,
            IMG_URL, 
            DESCRIPTION, 
            DATE_ADDED, 
            USER.USERNAME,
            USER.ID AS USER_ID 
        FROM 
            MOMENT
        JOIN 
            USER 
        ON 
            MOMENT.USER_ID = USER.ID 
        WHERE 
            ${where}
        ORDER BY 
            DATE_ADDED DESC 
        LIMIT 20
        `;
        return databaseUtil.sendQuery(query, values[0]).then((result) => {
            const moments = result.rows.map(moment => ({
                moment_id: moment.MOMENT_ID,
                user: {
                    user_id: moment.USER_ID,
                    username: moment.USERNAME,
                },
                img: moment.IMG_URL,
                description: moment.DESCRIPTION,
                date_added: moment.DATE_ADDED,
            }));

            // The response data includes a status code and the array of moments
            const data = {
                code: 1,
                moments,
            };

            // The request was successful
            return reply.response(data).code(200);
        }).catch((error) => {
            console.log(error);
            return reply.response({ code: 3 }).code(500); // Code 3 means unknown error
        });
    },
};

export default getMoments;
