const { ImageHeadersSchema } = require("./schema")
const InvariantError = require('../../exceptions/invariant-error');

const UploadsValidator = {
    validateImageHeaders: (headers) => {
        const result = ImageHeadersSchema.validate(headers);

        if (result.error) throw new InvariantError(result.error.message)
    },
};

module.exports = UploadsValidator;