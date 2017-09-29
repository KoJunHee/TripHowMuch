'use strict';

// Model
module.exports = {
    tableName: 'users',                  // lower case collection or table name
    connection: 'mongoConnection',      // dabase connection
    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        nickname: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true,
        }
    }
    // beforeCreate: function (item, next) {
    //     next();
    // },
    // afterCreate:function(item, next){
    //     next();
    // }
};
