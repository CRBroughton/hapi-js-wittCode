'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
const Connection = require('./dbconfig');
const Users = require('./models/users');
const Boom = require('@hapi/boom');

const users = {
    wittCode: {
        username: 'wittCode',
        password: 'soccer',
        id: 0,
        name: 'Witt Code'
    },
    Greg: {
        username: 'Greg',
        password: '1234',
        id: 1,
        name: 'Greg'
    }
};

const validate = async (request, username, password, h) => {
    if (!users[username]) {
        return { isValid: false }
    }

    const user = users[username];

    if (user.password === password) {
        return { isValid: true, credentials: { id: user.id, name: user.name }}
    } else {
        return { isValid: false }
    }
}

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
    },
    {
        plugin: require('@hapi/vision')
    },
    {
        plugin: require('@hapi/basic')
    },
]);

    server.auth.strategy('login', 'basic', { validate });

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views'),
        layout: 'default',
    })

    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('index.html');
        },
    },
    {
        method: 'GET',
        path: '/getUsers',
        handler: async (request, h) => {
            const dbConnection = await Connection.connect();
            return h.view('index', {users});
        }
    },
    {
        method: 'GET',
        path: '/dynamic',
        handler: (request, h) => {
            const data = {
                name: 'wittCode'
            }
            return h.view('index', data)
        }
    },
    {
        method: 'GET',
        path: '/download',
        handler: (request, h) => {
            return h.file('index.html', {
                mode: 'attachment',
                filename: 'welcome-download.html'
            });
        }
      },
      {
        method: 'GET',
        path: '/loginbasic',
        handler: (request, h) => {
            return "Welcome to my restricted page!";
        },
        options: {
            auth: 'login'
        }
    },
    {
        method: 'GET',
        path: '/logoutbasic',
        handler: (request, h) => {
            return Boom.unauthorized("You have been logged out");
        },
        options: {
            auth: 'login'
        }
    },
      {
          method: 'POST',
          path: '/login',
          handler: (request, h) => {
            Users.createUser(request.payload.username, request.payload.password)
            return h.view('index', { username: request.payload.username })
          }
      },
    {
        method: 'GET',
        path: '/location',
        handler: (request, h) => {
            const location = request.location.ip
            if (location) {
                return h.view('location', { location: request.location.ip });
            } else {
                return h.view('location', { location: 'Your location in not enabled'});
            }
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