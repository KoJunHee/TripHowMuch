/*
* posts Route
* Created by ikoobmacpro on 2017.09.27..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var controller = require('../controllers/posts');

module.exports = [
    { method: 'GET', path: '/posts', config: controller.findAll },  //index 
    { method: 'GET', path: '/posts/{postID}', config: controller.find },   //show
    { method: 'POST', path: '/posts', config: controller.create },  //create
    { method: 'PUT', path: '/posts/{postID}', config: controller.update }, //update
    { method: 'DELETE', path: '/posts/{postID}', config: controller.destroy },  //destroy
    { method: 'DELETE', path: '/posts', config: controller.destroyAll }  //destroy all
];