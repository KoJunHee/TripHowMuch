/*
* posts Model
* Created by ikoobmacpro on 2017.09.27..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

module.exports = {
    tableName: 'posts',                   // lower case collection or table name
    connection: 'mongoConnection',      // database connection
    attributes: {
        title:
        {
            type: 'string',
            required: true
        },
        body: {
            type: 'string',
            required: true
        },
        visitCnt: {
            type: 'integer',
            defaultsTo: 0
        },
        writerNickname: {
            type: 'string',
            required: true
        },
        deleteAndUpdate: {
            type: 'string',
            required: true,
            defaultsTo: 'impossible'
        }
    }
};
