/*
* pictures Model
* Created by ikoobmacpro on 2017.10.10..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

module.exports = {
    tableName: 'pictures',                   // lower case collection or table name
    connection: 'mongoConnection',      // database connection
    attributes: {
        base64: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        viewCnt: {
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
