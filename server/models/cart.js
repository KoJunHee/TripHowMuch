/*
* cart Model
* Created by junhee on 2017.10.25..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

module.exports = {
    tableName: 'cart',                   // lower case collection or table name
    connection: 'mongoConnection',      // database connection
    attributes: {
        email: {
            type: 'string',
            required: true
        },
        num: {
            type: 'integer',
            defaultsTo: 1,
        },
        area: {
            type: 'array'
        },
        stay: {
            type: 'array'
        },
        name:{
            type: 'string'
        }
    }
};
