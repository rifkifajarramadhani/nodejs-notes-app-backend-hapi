class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
 
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    async postNoteHandler(req, h) {
        this._validator.validateNotePayload(req.payload);
        const { title = 'untitled', body, tags } = req.payload;

        const noteId = await this._service.addNote({ title, body, tags });

        const res = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId
            },
        });
        res.code(201);
        return res;
    }

    async getNotesHandler() {
        const notes = await this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes
            },
        }
    }

    async getNoteByIdHandler(req, h) {
        const { id } = req.params;
        const note = await this._service.getNoteById(id);
        return {
            status: 'success',
            data: {
                note
            }
        };
    }

    async putNoteByIdHandler(req, h) {
        this._validator.validateNotePayload(req.payload);
        const { id } = req.params;

        await this._service.editNoteById(id, req.payload);

        return {
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        }
    }

    async deleteNoteByIdHandler(req, h) {
        const { id } = req.params;

        await this._service.deleteNoteById(id);

        return {
            status: 'success',
            message: 'Catatan berhasil dihapus'
        }
    }
}
module.exports = NotesHandler;