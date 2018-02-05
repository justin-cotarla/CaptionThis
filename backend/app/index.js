import Hapi from 'hapi';
import routes from './routes';

const server = new Hapi.Server({
	port: 8000,
	host: 'backend'
});

server.route({
	method: 'GET',
	path: '/api/hello',
	handler: (request, reply) => 'Hello World'
});

//Add all routes to server
server.route(routes);

server.start((err) => {
	if (err) throw err;
	console.log(`Server running at: ${server.info.uri}`);
});
