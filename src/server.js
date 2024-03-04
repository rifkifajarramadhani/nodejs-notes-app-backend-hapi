require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

//notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/notes-service');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/users-service');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/authentications-service');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/token-manager');
 
// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/collaborations-service');
const CollaborationsValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');

const ClientError = require('./exceptions/client-error');
const ProducerService = require('./services/rabbitmq/producer-service');
const ExportsValidator = require('./validator/exports');

const init = async () => {
    const collaborationsService = new CollaborationsService();
    const notesService = new NotesService(collaborationsService);
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();

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
            plugin: Jwt,
        }
    ]);
    
    server.auth.strategy('notesapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: notes,
            options: {
                service: notesService,
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
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                notesService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                validator: ExportsValidator,
            },
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