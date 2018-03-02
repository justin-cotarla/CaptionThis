import AWS from 'aws-sdk';

import databaseUtil from '../../utility/DatabaseUtil';

const putMoments = {
    method: 'PUT',
    path: '/api/moments',
    options: {
        payload: {
            output: 'stream',
            parse: 'true',
            allow: 'multipart/form-data',
            maxBytes: 5 * 1000 * 1000, // Max upload size 5MB
        },
    },
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply.response({ code: 4 }).code(401);
        }
        // Get the form data from request
        // const momentTitle = request.payload.title;
        const momentDesc = request.payload.description;

        // Other parameters for db query
        const userId = request.auth.credentials.user.id;
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
            Body: imageFile._data, // eslint-disable-line no-underscore-dangle
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

export default putMoments;
