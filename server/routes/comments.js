/*
* comments Route
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var controller = require('../controllers/comments');

module.exports = [
    { method: 'GET', path: '/comments', config: controller.findAll },   //index
    { method: 'GET', path: '/comments/more/{commentID}', config: controller.findMore },   //index    
    { method: 'GET', path: '/comments/{commentID}', config: controller.find }, //show
    { method: 'POST', path: '/comments/underpost', config: controller.createUnderPost },   //create
    { method: 'POST', path: '/comments/undercomment', config: controller.createUnderComment },   //create
    { method: 'PUT', path: '/comments/{commentID}', config: controller.update },   //update
    { method: 'DELETE', path: '/comments/{commentID}', config: controller.destroy }    //destroy
];knnnk;nknkj