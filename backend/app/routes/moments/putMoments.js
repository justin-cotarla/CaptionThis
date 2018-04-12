import AWS from 'aws-sdk';
import databaseUtil from '../../utility/DatabaseUtil';
import {
    GOOD,
    UNAUTHORIZED,
    INVALID_INPUT,
    UNKNOWN_ERROR,
} from '../../utility/ResponseCodes';

const putMoments = {
    method: 'PUT',
    path: '/api/moments',
    options: {
        payload: {
            output: 'stream',
            parse: 'true',
            allow: 'multipart/form-data',
            maxBytes: 10 * 1000 * 1000, // Max upload size 10MB
        },
    },
    handler: (request, reply) => {
        // If not authorized
        if (!request.auth.credentials) {
            return reply
                .response({ code: UNAUTHORIZED.code })
                .code(UNAUTHORIZED.http);
        }
        // Get the form data from request
        // const momentTitle = request.payload.title;
        const momentDesc = request.payload.description;

        // Other parameters for db query
        const userId = request.auth.credentials.user.id;
        let imageURL;

        // Get the uploaded file from request
        const imageFile = request.payload.file;

        // Check if the file is valid
        if (imageFile === undefined) {
            return reply
                .response({ code: INVALID_INPUT.code })
                .code(INVALID_INPUT.http);
        }

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

        return s3.upload(params).promise()
            .then((data) => {
                imageURL = data.Location; // Get image URL after uploading
                // Create db query
                const query = 'INSERT INTO MOMENT (IMG_URL, DESCRIPTION, USER_ID) VALUES (?, ?, ?)';
                return databaseUtil.sendQuery(query, [imageURL, momentDesc, userId]);
            })
            .then(() => reply
                .response({ code: GOOD.code })
                .code(GOOD.http))
            .catch(() => reply
                .response({ code: UNKNOWN_ERROR.code })
                .code(UNKNOWN_ERROR.http));
    },
};

export default putMoments;
