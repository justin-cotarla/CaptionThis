import databaseUtil from '../../utility/DatabaseUtil';

const getMoments = {
    method: 'GET',
    path: '/api/moments',
    handler: (request, reply) => {
        // Get limit query param, Hapi parses params as strings
        let { limit } = request.query;
        // If param is absent, it is undefined. If present but not specified, it is the empty string
        if (limit === undefined || limit === '') {
            limit = 20; // Default value for limit is 20
        } else if (!/^\d+$/.test(limit)) { // Test if string is only digits
            return reply.response({ code: 2, moments: [] }).code(400); // Code 2 means invalid input
        }

        // Parse limit to number to prep for db query
        limit = parseInt(limit, 10);

        // Create db query
        const query = `
        SELECT MOMENT.ID AS MOMENT_ID,
        IMG_URL, DESCRIPTION, DATE_ADDED, USER.USERNAME,
        USER.ID AS USER_ID FROM MOMENT
        JOIN USER ON MOMENT.USER_ID = USER.ID ORDER BY DATE_ADDED DESC LIMIT ?
        `;
        return databaseUtil.sendQuery(query, [limit]).then((result) => {
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
