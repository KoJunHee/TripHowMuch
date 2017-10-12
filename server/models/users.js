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
        password: {
            type: 'string',
            required: true,
        },
        nickname: {
            type: 'string',
            required: true,
            unique: true
        },
        authId:{
            type: 'string',
            defaultsTo: '0'
        },
        at:{
            type: 'string',
            defaultsTo: '0'            
        }
        
    }
    // beforeCreate: function (item, next) {
    //     next();
    // },
    // afterCreate:function(item, next){
    //     next();
    // }
};
