/*
* stay Controller
* Created by junhee on 2017.10.19..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Boom = require('boom'),
    Joi = require('joi'),
    Request = require('request'),
    Config = require('../config'),
    Co = require('co');


/*********************************************************************** 
 *                     - 숙소 등록하기 (db 저장 위해 한 번 쓰임)
*************************************************************************/
// exports.create = {
//     description: '숙소 등록',
//     tags: ['api'],
//     validate: {
//         query: {
//             areaCode: Joi.number().default("")
//                 .valid(['1', '2', '3', '4', '5', '6', '7', '8', '31', '32', '33', '34', '35', '36', '37', '38', '39'])
//                 .description('지역 코드'),

//             sigunguCode: Joi.number().default("")
//                 .valid(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'])
//                 .description('시군구 코드'),

//             pageNo: Joi.number().default(1)
//                 .description('페이지번호')
//         }
//     },
//     auth: false,
//     handler: function (request, reply) {

//         // make request url
//         var tourUrl = Config.openApi.baseUrl +
//             '/rest/KorService/searchStay' +
//             '?ServiceKey=' +
//             Config.openApi.myKey +
//             '&areaCode=' +
//             request.query.areaCode +
//             '&sigunguCode=' +
//             request.query.sigunguCode +
//             '&listYN=Y&MobileOS=ETC&MobileApp=tripHowMuch&_type=json&pageNo=' +
//             request.query.pageNo +
//             '&numOfRows=3090';

//         //tour api request  
//         Request({
//             method: 'GET',
//             uri: tourUrl
//         },
//             function (error, response, body) {
//                 if (error) {
//                     return console.error('upload failed:', error);
//                 }

//                 // //검색한 자료를 배열로 저장
//                 var resultArr = JSON.parse(body).response.body.items.item;
//                 var objectArr = [];
//                 for (var itemIndex in resultArr) {
//                     objectArr.push({
//                         contentid: resultArr[itemIndex].contentid,
//                         title: resultArr[itemIndex].title,
//                         firstimage: resultArr[itemIndex].firstimage
//                     })
//                 }

//                 //검색한 자료를 디비에 저장
//                 Co(function* () {
//                     try {
//                         yield Stay.create(objectArr);
//                         return;
//                     } catch (err) {
//                         throw err;
//                     }
//                 }).then(function () {
//                     console.log(objectArr.length + ' register finish');
//                 }).catch(function (err) {
//                     return reply(Boom.badImplementation(err));
//                 });
//             });
//     }
// };


/*********************************************************************** 
 *                              - 숙소 상세보기 (R)
*************************************************************************/
exports.find = {
    description: '숙소 상세보기 (R)',
    tags: ['api'],
    validate: {
        params: {
            contentid: Joi.number().required()
        }
    },
    auth: false,
    handler: function (request, reply) {

        //make request url
        var tourUrl = Config.openApi.baseUrl +
            '/rest/KorService/detailCommon' +
            '?ServiceKey=' +
            Config.openApi.myKey +
            '&contentTypeId=32' +
            '&contentId=' +
            request.params.contentid +
            '&MobileOS=ETC&MobileApp=tripHowMuch&' +
            '&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&' +
            'overviewYN=Y&transGuideYN=Y&_type=json';

        //request tour api
        Request({
            method: 'GET',
            uri: tourUrl
        },
            function (error, response, body) {
                if (error) {
                    return console.error('upload failed:', error);
                }

                //가져온 정보
                var tempInfo = JSON.parse(body).response.body.items.item;

                //필요한 정보만 추출
                Co(function* () {
                    try {
                        var stay = yield Stay.findOne({ contentid: tempInfo.contentid });
                        var resultInfo = {
                            price: stay.price,
                            overview: tempInfo.overview,
                            addr1: tempInfo.addr1,
                            addr2: tempInfo.addr2,
                            firstimage: tempInfo.firstimage,
                            title: tempInfo.title
                        }
                        return resultInfo;
                    }
                    catch (err) {
                        throw err;
                    }
                }).then(function (resultInfo) {
                    reply(resultInfo);
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                });
            })
    }
};

/*********************************************************************** 
 *                         - 숙소 정보 수정 (U)
*************************************************************************/
exports.update = {
    description: '숙소 정보 수정 (U)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            title: Joi.string().required()
        },
        payload: {
            price: Joi.number().required()
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 수정
        Stay.update({ title: request.params.title }, request.payload)
            .exec((err, stay) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(stay);
            });
    }
};


// /*********************************************************************** 
//  *                              - 숙소 type 정보 수정 (U)
// *************************************************************************/
exports.updateType = {
    description: '여행지 정보 수정 (U)',
    notes: ' ',
    tags: ['api'],
    validate: {
        payload: {
            type: Joi.number().required()
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 수정
        Stay.update({}, request.payload)
            .exec((err, stay) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(stay);
            });
    }
};


/*********************************************************************** 
 *                              - 숙박 검색
*************************************************************************/
exports.search = {
    description: '숙박 검색',
    tags: ['api'],
    validate: {
        query: {
            areaCode: Joi.number().default("")
                .valid(['1', '2', '3', '4', '5', '6', '7', '8', '31', '32', '33', '34', '35', '36', '37', '38', '39'])
                .description('지역 코드'),

            sigunguCode: Joi.number().default("")
                .valid(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'])
                .description('시군구 코드'),

            pageNo: Joi.number().default(1)
                .description('페이지번호'),

            money: Joi.number().default(0)
                .description('예산'),

            sort: Joi.number().default(0)
                .valid('0', '1')
                .description('낮은순 0 ,높은순 1')
        }
    },
    auth: false,
    handler: function (request, reply) {

        //request url
        var tourUrl = Config.openApi.baseUrl +
            '/rest/KorService/searchStay' +
            '?ServiceKey=' +
            Config.openApi.myKey +
            '&areaCode=' +
            request.query.areaCode +
            '&sigunguCode=' +
            request.query.sigunguCode +
            '&listYN=Y&MobileOS=ETC&MobileApp=tripHowMuch&_type=json&pageNo=' +
            request.query.pageNo;

        Request({
            method: 'GET',
            uri: tourUrl
        },
            function (error, response, body) {
                if (error) {
                    return console.error('upload failed:', error);
                }

                var tempArr = JSON.parse(body).response.body.items.item;
                var resultArr = [];

                var totalCount = {
                    cnt: 0
                };

                //검색한 숙소들의 가격찾기
                Co(function* () {
                    try {
                        for (var itemIdex in tempArr) {
                            var stay = yield Stay.findOne({ contentid: tempArr[itemIdex].contentid });

                            //검색한 숙소의 가격이 예산이하이면
                            if (stay.price <= request.query.money) {
                                var object = {
                                    contentid: stay.contentid,
                                    titile: stay.title,
                                    firstimage: stay.firstimage,
                                    price: stay.price
                                };
                                resultArr.push(object);
                                totalCount.cnt++;
                            }
                        }

                           //정렬
                           var sortingField = "price";
                           if (request.query.sort == 0) {
                               resultArr.sort(function (a, b) {  //가격 낮은 순
                                   return a[sortingField] - b[sortingField];
                               });
                           }else{
                               resultArr.sort(function (a, b) {  //가격 높은 순
                                   return b[sortingField] - a[sortingField];
                               });
                           }


                        resultArr.push(totalCount);
                        return resultArr;
                        // return result;
                    } catch (err) {
                        throw err;
                    }
                }).then(function (resultArr) {
                    reply(resultArr);
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                });

            })
    }
};










