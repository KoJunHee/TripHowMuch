/*
* comments Model
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

module.exports = {
    tableName: 'comments',                   // lower case collection or table name
    connection: 'mongoConnection',      // database connection
    attributes: {
        content: {
            type: 'string',
            required: true
        },
        writer:{
            type:'string',
            required: true
        },
        parent:{    //댓글에 대한 댓글인지, 게시물에 대한 댓글인지
            type:'string',
            required: true,
        },  
        parentID:{
            type:'string',
            required: true
        },
        deleteAndUpdate:{
            type:'string',
            required: true,
            defaultsTo: 'impossible'
        }
    }
};
