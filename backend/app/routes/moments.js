import databaseUtil from '../utility/DatabaseUtil';

// GET moments sorted by date
const getMomentsByDate = {
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
        const query = 'SELECT * FROM MOMENT ORDER BY DATE_ADDED DESC LIMIT ?';
        return databaseUtil.sendQuery(query, [limit]).then((result) => {
            const moments = result.rows.map(moment => ({
                moment_id: moment.ID,
                user_id: moment.USER_ID,
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
            return reply.response({ code: 3, moments: [] }).code(500); // Code 3 means unknown error
        });
    },
};

export default [
    getMomentsByDate,
];
