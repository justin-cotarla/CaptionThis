import databaseUtil from '../utility/DatabaseUtil';

// GET moments sorted by date
const getMomentsByDate = {
    method: 'GET',
    path: '/api/moments',
    handler: (request, reply) => {
        // Get limit query param
        let { limit } = request.query;

        // Check if limit param is a number
        limit = parseInt('5', 10);

        // Build string for db query
        if (!Number.isNaN(limit)) {
            limit = ` LIMIT ${limit}`;
        } else {
            limit = '';
        }

        // Create db query
        const query = `SELECT * FROM MOMENT${limit}`;
        return databaseUtil.sendQuery(query).then((result) => {
            const moments = result.rows.map(moment => ({
                id: moment.ID,
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
            return reply.response({ code: 2, error: 'Internal Server Error' }).code(500);
        });
    },
};

export default [
    getMomentsByDate,
];
