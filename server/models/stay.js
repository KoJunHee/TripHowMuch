/*
* stay Model
* Created by junhee on 2017.10.19..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

module.exports = {
    tableName: 'stay',                   // lower case collection or table name
    connection: 'mongoConnection',      // database connection
    attributes: {
        contentid: {
            type: 'integer',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        firstimage: {
            type: 'string'
        },
        price: {
            type: 'integer',
            defaultsTo: 40000
        },
        type:{
            type: 'integer'
        }
    }
};
