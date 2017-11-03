/*
* cart Controller
* Created by junhee on 2017.10.25..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Boom = require('boom'),
    Joi = require('joi'),
    Co = require('co');

/*********************************************************************** 
 *                              - 카트 등록 (C)
*************************************************************************/
exports.create = {
    description: '카트 등록 (C)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required()
        },
        payload: {
            area: Joi.array().items(Joi.number()),
            stay: Joi.array().items(Joi.number()),
            title: Joi.string()
        }
    },
    auth: false,
    handler: (request, reply) => {

        //이미 있는지 체크하고 등록
        Co(function* () {
            try {
                var carts = yield Cart.find(request.params);

                var num = 1;
                if (carts.length == 0) {
                } else {
                    num = carts[carts.length - 1].num + 1;
                }

                // 등록
                var cart = yield Cart.create({
                    email: request.params.email,
                    area: request.payload.area,
                    stay: request.payload.stay,
                    num: num,
                    title: request.payload.title
                });

                return cart;
            }

            catch (err) {
                throw err;
            }
        }).then(function (cart) {
            reply(cart);
        }).catch(function (err) {
            return reply(Boom.badImplementation(err));
        });

    }
};

/*********************************************************************** 
 *                              - 전체 카트 목록 조회 (R)
*************************************************************************/
exports.findAll = {
    description: '전체 카트 목록 조회 (R)',
    notes: ' ',
    tags: ['api'],
    auth: false,
    handler: (request, reply) => {
        // 전체 조회
        Cart.find()
            .exec((err, cart) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(cart);
            });
    }
};

/*********************************************************************** 
 *                      - 특정 유저의 특정 카트 상세 조회 (R)
*************************************************************************/
exports.find = {
    description: '특정 유저의 특정 카트 상세 조회 (R)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required(),
            num: Joi.number().required()
        }
    },
    auth: false,
    handler: (request, reply) => {

        Co(function* () {
            try {
                var areaArr = [];
                var stayArr = [];

                //해당하는 카트를 찾음
                var cart = yield Cart.findOne(request.params);

                //해당하는 카드가 있으면
                if (cart) {
                    //카트에 담긴 여행지의 id에 해당하는 여행지를 찾아서 배열에 저장
                    for (var areaIndex in cart.area) {
                        var area = yield Area.findOne({ contentid: cart.area[areaIndex] });
                        areaArr.push(area);
                    }

                    //카트에 담긴긴 숙소의 id에 해당하는 숙소를 찾아서 배열에 저장
                    for (var stayIndex in cart.stay) {
                        var stay = yield Stay.findOne({ contentid: cart.stay[stayIndex] });
                        stayArr.push(stay);
                    }
                }

                //reply 할것
                var result = {
                    area: areaArr,
                    stay: stayArr,
                    title: cart.title
                }

                return result;
            }
            catch (err) {
                throw err;
            }
        }).then(function (result) {
            reply(result);
        }).catch(function (err) {
            return reply(Boom.badImplementation(err));
        });


    }
};

/*********************************************************************** 
 *                              - 특정 유저의 카트 목록 조회 (R)
*************************************************************************/
exports.findUserCart = {
    description: '특정 유저의 카트 목록 조회 (R)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required()
        }
    },
    auth: false,
    handler: (request, reply) => {

        Co(function* () {
            try {
                var carts = yield Cart.find(request.params);

                var areaArr = [];
                var stayArr = [];
                var resultArr = [];

                //해당 이메일의 카트가 하나라도 있으면
                if (carts) {
                    for (var cartIndex in carts) {

                        //area
                        for (var areaIndex in carts[cartIndex].area) {
                            var area = yield Area.findOne({ contentid: carts[cartIndex].area[areaIndex] });
                            areaArr.push(area);
                        }

                        //stay
                        for (var stayIndex in carts[cartIndex].stay) {
                            var stay = yield Stay.findOne({ contentid: carts[cartIndex].stay[stayIndex] });
                            stayArr.push(stay);
                        }

                        //title
                        var title = carts[cartIndex].title;

                        //reply할 객체배열의 객체
                        var obj = {
                            email: carts[cartIndex].email,
                            area: areaArr,
                            stay: stayArr,
                            num: carts[cartIndex].num,
                            title: title
                        };

                        resultArr.push(obj);
                        areaArr = [];
                        stayArr = [];
                    }
                }
                return resultArr;

            }
            catch (err) {
                throw err;
            }
        }).then(function (resultArr) {
            reply(resultArr);
        }).catch(function (err) {
            return reply(Boom.badImplementation(err));
        });

    }
};
/*********************************************************************** 
 *                     - 특정 유저의 특정 카트 수정 (U)
*************************************************************************/
exports.update = {
    description: '특정 유저의 특정 카트 수정 (U)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required(),
            num: Joi.number().required()
        },
        payload: {
            area: Joi.array().items(Joi.number()),
            stay: Joi.array().items(Joi.number()),
            title: Joi.string()
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 수정
        Cart.update(request.params, request.payload)
            .exec((err, cart) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(cart);
            });
    }
};

/*********************************************************************** 
 *                   - 특정 유저의 특정 카트들 삭제 (D)
*************************************************************************/
exports.destroy = {
    description: '특정 유저의 특정 카트들 삭제 (D)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required()
        },
        payload: {
            num: Joi.array().items(Joi.number())
        }
    },
    auth: false,
    handler: (request, reply) => {


        Co(function* () {
            try {
                // 카트 중에서 입력한 이메일에 해당하는 카트 배열 찾음
                var carts = yield Cart.find(request.params);
                //해당하는 카트가 있으면
                if (carts) {

                    // 배열로 들어온 num의 갯수만큼 반복문 돌림
                    for (var i in request.payload.num) {
                        for (var j in carts) {
                            if (carts[j].num == request.payload.num[i]) {
                                yield Cart.destroy({ email: request.params.email, num: request.payload.num[i] });
                            }
                        }
                    }

                }
                return;

            }
            catch (err) {
                throw err;
            }
        }).then(function () {
            reply('success');
        }).catch(function (err) {
            return reply(Boom.badImplementation(err));
        });

    }
};

/*********************************************************************** 
 *                   - 특정 유저의 특정 카트의 특정 contents 삭제 (D)
*************************************************************************/
exports.destroyContents = {
    description: '특정 유저의 특정 카트의 특정 contents 삭제 (D)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required(),
            num: Joi.number().required()
        },
        payload: {
            contents: Joi.array().items(Joi.number())
        }
    },
    auth: false,
    handler: (request, reply) => {


        Co(function* () {
            try {
                var cart = yield Cart.find(request.params);
                // 배열로 들어온 num의 갯수만큼 반복문 돌림
                for (var i in request.payload.contents) {

                    //여행지에서 지우고자 하는게 있는지
                    for (var j in cart[0].area) {
                        if (request.payload.contents[i] == cart[0].area[j]) {
                            cart[0].area.splice(j, 1);
                            yield cart[0].save();
                        }
                    }

                    //숙소에서 지우고자 하는게 있는지
                    for (var j in cart[0].stay) {
                        if (request.payload.contents[i] == cart[0].stay[j]) {
                            cart[0].stay.splice(j, 1);
                            yield cart[0].save();
                        }
                    }
                }

                return;

            }
            catch (err) {
                throw err;
            }
        }).then(function () {
            reply('success');
        }).catch(function (err) {
            return reply(Boom.badImplementation(err));
        });

    }
};

/*********************************************************************** 
 *                         - 전체 카트 삭제 (D)
*************************************************************************/
exports.destroyAll = {
    description: '전체 카트 삭제 (D)',
    notes: ' ',
    tags: ['api'],
    auth: false,
    handler: (request, reply) => {
        // 삭제
        Cart.destroy({})
            .exec((err) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy all carts');
            });
    }
};


