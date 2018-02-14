import * as AuthUtil from '../../utility/AuthUtil';

const loginUser = {
    method: 'POST',
    path: '/api/auth/login',
    handler: (request, reply) => {
        const { username, password } = request.payload;

        if (username === undefined || username === ''
            || password === undefined || password === '') {
            // Invalid input
            return reply.response({ code: 2 }).code(400);
        }

        return AuthUtil.authenticate(username, password)
            .then(user => AuthUtil.generateToken(user))
            .then(token => reply.response({ code: 1, token }).code(200))
            .catch((err) => {
                if (err.message === 'User does not exists') {
                    // User does not exist
                    return reply.response({ code: 3 }).code(404);
                } else if (err.message === 'Wrong password') {
                    // Wrong password
                    return reply.response({ code: 4 }).code(401);
                }
                // Unknown error
                return reply.response({ code: 5 }).code(500);
            });
    },
};

export default [
    loginUser,
];
