'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 1234
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return "<h1>Hello World</h1>";
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{user?}',
        handler: (request, h) => {
            const user = request.params.user ? request.params.user : '';
            return `<h1>Hello ${user}</h1>`;
        }
    })

    server.route({
        method: 'GET',
        path: '/query',
        handler: (request, h) => {
            const name = request.query.name ? request.query.name : '';
            const lastname = request.query.lastname ? request.query.lastname : '';
            return `<h1>${name} ${lastname}</h1>`;
        }
    })

    await server.start();
    console.log(`server started on, ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();