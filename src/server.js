const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const noteService = new NotesService();

    const server = Hapi.server({
        port: 3000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            },
        }
    });

    await server.register({
        plugin: notes,
        options: {
            service: noteService,
            validator: NotesValidator,
        }
    });

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