/*
* comments Route
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var controller = require('../controllers/search');

module.exports = [
    {method: 'GET', path: '/search', config: controller.search}
];