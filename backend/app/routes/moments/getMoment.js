import databaseUtil from '../../utility/DatabaseUtil';

const getMoment = {
    method: 'GET',
    path: '/api/moments/{momentid}',
    handler: (request, reply) => {
        // Get limit query param, Hapi parses params as strings

        const id = parseInt(request.params.momentid, 10);

        // Create db query
        const query = 'SELECT * FROM MOMENT WHERE ID =?';
        return databaseUtil.sendQuery(query, [id]).then((result) => {
            if (!result.rows[0]) {
                reply.response({ code: 3 }).code(404);
            }

            const moment = {
                moment_id: result.rows[0].ID,
                img_url: result.rows[0].IMG_URL,
                description: result.rows[0].DESCRIPTON,
                date_added: result.rows[0].DATE_ADDED,
                user_id: result.rows[0].USER_ID,
            };

            // The response data includes a status code and the moment
            const data = {
                code: 1,
                moment,
            };

            // The request was successful
            return reply.response(data).code(200);
        }).catch((error) => {
            console.log(error);
            return reply.response({ code: 4 }).code(500); // Code 4 means unknown error
        });
    },
};

export default getMoment;
