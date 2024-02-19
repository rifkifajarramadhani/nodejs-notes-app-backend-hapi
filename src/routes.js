const { 
    addNoteHandler, 
    getAllNotesHandler, 
    editNoteByIdHandler,
     deleteNoteByIdHandler 
} = require("./handler");

const routes = [
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler
    },
    {
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getAllNotesHandler
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNoteByIdHandler
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteByIdHandler
    },
];

module.exports = routes;