import * as AuthUtil from '../../utility/AuthUtil';

const validateToken = {
    method: 'POST',
    path: '/api/auth/tokens',
    handler: (request, reply) => {
        if (!request.payload) {
            return reply.response({ code: 2 }).code(400);
        }

        const { token } = request.payload;

        if (token === undefined || token === '') {
            return reply.response({ code: 2 }).code(400);
        }

        return AuthUtil.validateToken(token)
            .then(({ id, username }) => AuthUtil.generateToken({ id, username }))
            .then(newToken => reply.response({ code: 1, newToken }).code(200))
            .catch((err) => {
                if (err.message === 'invalid signature') {
                    return reply.response({ code: 3 }).code(400);
                }
                return reply.response({ code: 99 }).code(500);
            });
    },
};

export default [
    validateToken,
];
