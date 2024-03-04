class UploadsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
 
        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(req, h) {
        const { data } = req.payload;
        this._validator.validateImageHeaders(data.hapi.headers);

        const fileLocation = await this._service.writeFile(data, data.hapi);

        const res = h.response({
            status: 'success',
            data: {
                fileLocation
            },
        });
        res.code(201);
        return res;
    }
}

module.exports = UploadsHandler;