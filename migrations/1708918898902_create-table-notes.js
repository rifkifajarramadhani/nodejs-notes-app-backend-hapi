/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('notes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notnull: true,
        },
        body: {
            type: 'TEXT',
            notnull: true,
        },
        tags: {
            type: 'TEXT[]',
            notnull: true,
        },
        created_at: {
            type: 'TEXT',
            notnull: true,
        },
        updated_at: {
            type: 'TEXT',
            notnull: true,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('notes');
};
