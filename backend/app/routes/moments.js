import AWS from 'aws-sdk';
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
            return reply.response({ code: 3, moments: [] }).code(500); // Code 3 means unknown error
        });
    },
};

// PUT new moments created by user
const createMoment = {
    method: 'PUT',
    path: '/api/moments/',
    options: {
        payload: {
            output: 'stream',
            parse: 'true',
            allow: 'multipart/form-data',
            maxBytes: 5 * 1000 * 1000, // Max upload size 5MB
        },
    },
    handler: (request, reply) => {
        // Get the form data from request
        // const momentTitle = request.payload.title;
        const momentDesc = request.payload.description;

        // Other parameters for db query
        const userId = 1; // Placeholder id
        let imageURL;

        // Get the uploaded file from request
        const imageFile = request.payload.file;
        const imageName = imageFile.hapi.filename;

        // Define S3 bucket
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION,
        });

        // Stream upload the image directly to AWS S3 bucket
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: imageName,
            Body: imageFile._data,
            ACL: 'public-read',
        };

        return s3.upload(params).promise().then((data) => {
            console.log('Successfully uploaded image to S3.');
            imageURL = data.Location; // Get image URL after uploading
            // Create db query
            const query = 'INSERT INTO MOMENT (IMG_URL, DESCRIPTION, USER_ID) VALUES (?, ?, ?)';
            return databaseUtil.sendQuery(query, [imageURL, momentDesc, userId])
                .then(() => reply.response({ code: 1 }).code(200))
                .catch((error) => {
                    console.log(error);
                    return reply.response({ code: 3 }).code(500);
                });
        }).catch((error) => {
            console.log('Error uploading image. ', error);
            return reply.response({ code: 3 }).code(500);
        });
    },
};

export default [
    getMomentsByDate,
    createMoment,
];
