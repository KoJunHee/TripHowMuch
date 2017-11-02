/*
* stay Route
* Created by junhee on 2017.10.19..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Controller = require('../controllers/stay');

module.exports = [
    //{method: 'POST', path: '/stay', config: Controller.create},                   //숙소 등록하기 (C)        
    { method: 'GET', path: '/stay/{contentid}', config: Controller.find },          //특정  조회 (R)  
    //{ method: 'GET', path: '/area', config: Controller.findAll },                 //모든 숙소 조회 (R)
    { method: 'PUT', path: '/stay/{title}', config: Controller.update },            //특정 숙소 수정 (U)
    { method: 'PUT', path: '/stay', config: Controller.updateType },                //특정 숙소 type 수정 (U)    
    //{ method: 'DELETE', path: '/area/{contentid}', config: Controller.destroy },  //특정 숙소 삭제 (D)
    //{ method: 'DELETE', path: '/area', config: Controller.destroyAll },           //모든 숙소 삭제 (D)
    { method: 'GET', path: '/stay/search', config: Controller.search }              //숙소 검색
];