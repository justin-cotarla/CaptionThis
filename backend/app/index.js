import Hapi from 'hapi';

const server = new Hapi.Server({ port: 8000, host: 'backend' });

server.route({
  method: 'GET',
  path: '/api/hello',
  handler: (request, h) => h.response('Hello World!'),
});

server.start((err) => {
  if (err) throw err;
  console.log(`Server running at: ${server.info.uri}`);
});
