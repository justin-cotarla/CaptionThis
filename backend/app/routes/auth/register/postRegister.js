import * as AuthUtil from '../../../utility/AuthUtil';

// Register user
const postRegister = {
    method: 'POST',
    path: '/api/auth/register',
    handler: (request, reply) => {
        if (!request.payload) {
            return reply.response({ code: 2 }).code(400);
        }

        const { username, password } = request.payload;

        if (username === undefined || username === ''
            || password === undefined || password === '') {
            // Invalid input
            return reply.response({ code: 2 }).code(400);
        }

        return AuthUtil.register(username, password)
            .then(user => AuthUtil.generateToken(user))
            .then(token => reply.response({ code: 1, token }).code(200))
            .catch((err) => {
                if (err.message === 'User exists') {
                    // User exists
                    return reply.response({ code: 3 }).code(409);
                }
                // Unknown error
                return reply.response({ code: 4 }).code(500);
            });
    },
};

export default postRegister;