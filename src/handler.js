const { nanoid } = require("nanoid");
const notes = require('./notes');

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
});

const addNoteHandler = (req, h) => {
    const { title, tags, body } = req.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const res = h.response({
            status: 'success',
            message: 'Notes added',
            data: {
                noteId: id
            }
        });
        res.code(201);
        return res;
    }

    const res = h.response({
        status: 'success',
        message: 'Notes not added',
    });
    res.code(500);
    return res;
};

const getNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const note = notes.filter((note) => note.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const res = h.response({
        status: 'fail',
        message: 'Note not found'
    });
    res.code(404);
    return res;
}

const editNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const { title, tags, body } = req.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        };

        const res = h.response({
            status: 'success',
            message: 'Note updated'
        });
        res.code(200);
        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Update note fail, bote not found'
    });
    res.code(404);
    return res;
}

const deleteNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const index = notes.filter((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const res = h.response({
            status: 'success',
            message: 'Note deleted'
        });
        res.status(200);
        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Note not found'
    });
    res.status(404);
    return res;
}

module.exports = { 
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler, 
    deleteNoteByIdHandler
};