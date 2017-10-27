/*
* user Route
* Created by junhee on 2017.10.19..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Controller = require('../controllers/user');

module.exports = [
    { method: 'POST', path: '/user', config: Controller.create },             //유저 등록 (C)  
    { method: 'GET', path: '/user/{email}', config: Controller.find },        //특정 유저 조회 (R)  
    { method: 'GET', path: '/user', config: Controller.findAll },             //모든 유저 조회 (R)
    { method: 'PUT', path: '/user/{email}', config: Controller.update },      //특정 유저 수정 (U)  
    { method: 'DELETE', path: '/user/{email}', config: Controller.destroy },  //특정 유저 삭제 (U)
    { method: 'DELETE', path: '/user', config: Controller.destroyAll },       //모든 유저 삭제 (D)
    { method: 'POST', path: '/login', config: Controller.login },             //로그인
];