'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');

const init = async () => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 1234,
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([{
        plugin: require('hapi-geo-locate'),
        options: {
            enabledByDefault: true
        }
    },
    {
        plugin: require('@hapi/inert')
    }
]);


    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('index.html');
        },
    },
    {
        method: 'GET',
        path: '/location',
        handler: (request, h) => {
            const location = request.location
            if (location) {
                return location
            }
            return "<h1>Your location is not enabled by default!</h1>";
        }
      },
    {
        method: 'GET',
        path: '/users/{user?}',
        handler: (request, h) => {
            const user = request.params.user ? request.params.user : 'Stranger';
            return `<h1>Hello ${user}</h1>`;
        }
    },
    {
        method: 'GET',
        path: '/query',
        handler: (request, h) => {
            const name = request.query.name ? request.query.name : '';
            const lastname = request.query.lastname ? request.query.lastname : '';
            return `<h1>${name} ${lastname}</h1>`;
        }
    },
    {
        method: 'GET',
        path: '/redirect',
        handler: (request, h) => {
            return h.redirect('/');
        }
    },
    {
        method: 'GET',
        path: '/{any*}',
        handler: (request, h) => {
            return "<h1>Oh no! You must be lost!</h1>"
        }
    }]);

    await server.start();
    console.log(`server started on, ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();