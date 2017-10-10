/*
* pictures Route
* Created by ikoobmacpro on 2017.10.10..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var controller = require('../controllers/pictures');

module.exports = [
    { method: 'GET', path: '/pictures', config: controller.findAll },
    { method: 'GET', path: '/pictures/{picturesId}', config: controller.find },
    { method: 'POST', path: '/pictures', config: controller.create },
    { method: 'PUT', path: '/pictures/{picturesId}', config: controller.update },
    { method: 'DELETE', path: '/pictures/{picturesId}', config: controller.destroy }
];