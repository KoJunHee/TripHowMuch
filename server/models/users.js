'use strict';

// Model
module.exports = {
    tableName: 'users',                  // lower case collection or table name
    connection: 'mongoConnection',      // dabase connection
    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true,
            defaultsTo: '0'
        },
        password: {
            type: 'string',
            required: true,
            defaultsTo: '0'
        },
        nickname: {
            type: 'string',
            required: true,
            defaultsTo: '0'
        },
        authId:{
            type: 'string',
            defaultsTo: '0'
        }
    }
};
