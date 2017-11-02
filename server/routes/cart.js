/*
* cart Route
* Created by junhee on 2017.10.25..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Controller = require('../controllers/cart');

module.exports = [
    { method: 'POST', path: '/cart/{email}', config: Controller.create },           //카드 등록 (C)    
    { method: 'GET', path: '/cart/{email}/{num}', config: Controller.find },        //특정 카트 조회 (R)    
    { method: 'GET', path: '/cart', config: Controller.findAll },                   //모든 카트 조회 (R)
    { method: 'GET', path: '/cart/{email}', config: Controller.findUserCart },      //특정 유저의 카트 목록 조회 (R)    
    { method: 'PUT', path: '/cart/{email}/{num}', config: Controller.update },      //특정 카트 수정 (U)         
    { method: 'DELETE', path: '/cart/{email}', config: Controller.destroy },  //특정 카드들 삭제 (D)
    { method: 'DELETE', path: '/cart/{email}/{num}', config: Controller.destroyContents},  //특정 카트의 내용물들 삭제 (D)    
    { method: 'DELETE', path: '/cart', config: Controller.destroyAll }              //모든 카트 삭제 (D)
];