/*
* comments Route
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

var Controller = require('../controllers/area');

module.exports = [
    //{method: 'POST', path: '/area', config: Controller.create},                   //여행지 등록하기 (C)        
    { method: 'GET', path: '/area/{contentid}', config: Controller.find },          //특정 여행지 조회 (R)  
    //{ method: 'GET', path: '/area', config: Controller.findAll },                 //모든 여행지 조회 (R)
    // { method: 'PUT', path: '/area/{title}', config: Controller.update },         //특정 여행지 수정 (U)  
    //{ method: 'PUT', path: '/area', config: Controller.updateType },              //특정 여행지 type 수정 (U)      
    //{ method: 'DELETE', path: '/area/{contentid}', config: Controller.destroy },  //특정 여행지 삭제 (D)
    //{ method: 'DELETE', path: '/area', config: Controller.destroyAll },           //모든 여행지 삭제 (D)
    { method: 'GET', path: '/area/search', config: Controller.search },             //여행지 검색


    
];