/*
* comments Controller
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var Boom = require('boom'),
    Joi = require('joi'),
    Request = require('request'),
    Config = require('../config'),
    QS = require('querystring');


//find data
exports.search = {
    description: '검색',
    tags: ['api'],
    validate: {
        query: {
            areaCode: Joi.number().default("")
            .valid(['1', '2', '3', '4', '5', '6', '7', '8', '31', '32', '33', '34', '35', '36', '37', '38', '39'])
            .description('지역 코드'),
            
            sigunguCode: Joi.number().default("")
            .valid(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'])
            .description('시군구 코드'),
            
            cat1: Joi.string().default("")
            .valid(['A01', 'A02'])
            .description('대분류'),
            
            cat2: Joi.string().default("")
            .valid(['A0101', 'A0102'],['A0201','A0202','A0203','A0204','A0205','A0206','A0207','A0208'])
            .description('중분류')
        }
    },
    auth: false,
    handler: function (request, reply) {
        
        //request url
        var tourUrl = Config.openApi.baseUrl + 
        '/rest/KorService/areaBasedList' + 
        '?ServiceKey=' + 
        Config.openApi.myKey +
        '&contentTypeId=12'+
        '&areaCode='+
        request.query.areaCode+
        '&sigunguCode='+
        request.query.sigunguCode+
        '&cat1='+
        request.query.cat1+
        '&cat2='+
        request.query.cat2+ 
        '&cat3='+
        '&listYN=Y&MobileOS=ETC&MobileApp=tripHowMuch&_type=json';

        Request({
            method: 'GET',
            uri: tourUrl
        },
            function (error, response, body) {
                if (error) {
                    return console.error('upload failed:', error);
                }
                reply(JSON.parse(body));
            })
    }

};
