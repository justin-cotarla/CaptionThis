import Hapi from 'hapi';

import routes from './routes';
import databaseUtil from './utility/DatabaseUtil';
import * as AuthUtil from './utility/AuthUtil';

const server = new Hapi.Server({
    port: 8000,
    host: 'backend',
    routes: {
        cors: true,
    },
});

const scheme = () => ({
    authenticate: (request, h) => {
        // No token
        if (!request.headers.authorization) {
            return h.unauthenticated();
        }
        const token = request.headers.authorization.substring(7);
        return AuthUtil.validateToken(token)
            .then(decoded => h.authenticated({ credentials: { user: decoded } }))
            .catch((err) => {
                console.log(err);
                return h.unauthenticated();
            });
    },
});

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');
server.auth.default('default');

// Test handler
const helloworld = (request, h) => {
    // Your query can have ? in place of parameters
    const queryString = `
        SELECT *
        FROM USER
        WHERE ID = ?
        AND
        USERNAME LIKE ?;
    `;

    // The second argument of sendQuery expects an array of parameters
    // for the query (in this case 1 and test-user)
    // Second argument can be omitted if no parameters are required
    return databaseUtil.sendQuery(queryString, [1, 'test-user'])
        .then((result) => {
            if (result.rows.length === 0) {
                console.log('No matching user');
            } else {
                console.log(`User: ${result.rows[0].USERNAME}`);
            }
            return h.response('hello world');
        })
        .catch((err) => {
            console.log(err);
            return h.response('no users');
        });
};

server.route({
    method: 'GET',
    path: '/api/hello',
    handler: helloworld,
});

// Add all routes to server
server.route(routes);

// Start server
server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
});

// Properly dispose of database connection on shutdown
process.on('SIGINT', () => {
    databaseUtil.end();
    process.exit();
});
