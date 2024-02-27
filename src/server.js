require('dotenv').config();

const Hapi = require('@hapi/hapi');

//notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/notes-service');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/users-service');
const UsersValidator = require('./validator/users');

const ClientError = require('./exceptions/client-error');

const init = async () => {
    const noteService = new NotesService();
    const usersService = new UsersService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            },
        }
    });

    await server.register([
        {
            plugin: notes,
            options: {
                service: noteService,
                validator: NotesValidator,
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            }
        },
    ]);

    server.ext('onPreResponse', (req, h) => {
        const { response } = req;

        if (response instanceof ClientError) {
            const newRes = h.response({
                status: 'fail',
                message: response.message
            });
            newRes.code(response.statusCode);
            return newRes;
        }

        return h.continue;
    })

    await server.start();
    console.log(`Server running at ${server.info.uri}`)
}

init();