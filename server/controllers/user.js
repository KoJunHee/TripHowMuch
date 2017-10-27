/*
* user Controller
* Created by junhee on 2017.10.19..
* Copyright (c) 2017 junhee. All rights reserved.
*/

'use strict';

const Boom = require('boom'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken');


/*********************************************************************** 
 *                              - 유저 등록 (C)
*************************************************************************/
exports.create = {
    description: '유저 등록 (C)',
    notes: ' ',
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),
            key: Joi.number().required().valid('1', '2')
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 전체 조회
        User.create(request.payload)
            .exec((err, user) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};

/*********************************************************************** 
 *                              - 유저 목록 조회 (R)
*************************************************************************/
exports.findAll = {
    description: '유저 목록 조회 (R)',
    notes: ' ',
    tags: ['api'],
    auth: false,
    handler: (request, reply) => {
        // 전체 조회
        User.find()
            .exec((err, user) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};

/*********************************************************************** 
 *                              - 유저 상세 조회 (R)
*************************************************************************/
exports.find = {
    description: '유저 상세 조회 (R)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required()
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 조회
        User.findOne({ email: request.params.email })
            .exec((err, user) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};

/*********************************************************************** 
 *                         - 유저 정보 수정 (U)
*************************************************************************/
exports.update = {
    description: '유저 정보 수정 (U)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params:{
            email: Joi.string().required()
        },
        payload: {
            email: Joi.string().required(),
            key: Joi.number().required().valid('1', '2')
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 수정
        User.update({ email: request.params.email}, request.payload)
            .exec((err, user) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};


/*********************************************************************** 
 *                         - 특정 유저 삭제 (D)
*************************************************************************/
exports.destroy = {
    description: '특정 유저 삭제 (D)',
    notes: ' ',
    tags: ['api'],
    validate: {
        params: {
            email: Joi.string().required()
        }
    },
    auth: false,
    handler: (request, reply) => {
        // 삭제
        User.destroy({ email: request.params.email })
            .exec((err) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply({ result: true });
            });
    }
};

/*********************************************************************** 
 *                          - 모든 유저 삭제 (D)
*************************************************************************/
exports.destroyAll = {
    description: '모든 유저 삭제 (D)',
    notes: ' ',
    tags: ['api'],
    auth: false,
    handler: (request, reply) => {
        // 삭제
        User.destroy({})
            .exec((err) => {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy all users');
            });
    }
};

/*********************************************************************** 
 *                              - 로그인 
*************************************************************************/
exports.login = {
    description: '로그인 - key: 구글(1), 페북(2)',
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),
            key: Joi.number().required().valid('1', '2')
        }
    },
    auth: {
        mode: 'try',
        strategy: 'token'
    },
    handler: function (request, reply) {
        //mail exist check
        User.findOne({ email: request.payload.email, key: request.payload.key })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                //user가 없으면 
                if (!user) {
                    //생성
                    User.create(request.payload)
                        .exec((err, user) => {
                            // 결과
                            if (err) {
                                return reply(Boom.badImplementation(err));
                            }

                            //token
                            var tokenData = {
                                email: user.email,
                                id: user.id
                            };
                            var res = {
                                token: jwt.sign(tokenData, 'app_server!!!')
                            };
                            reply(res);


                        });
                    //user가 있으면
                } else if (user) {

                    var tokenData = {
                        email: user.email,
                        id: user.id
                    };
                    var res = {
                        token: jwt.sign(tokenData, 'app_server!!!')
                    };
                    reply(res);
                }
            })
    }
};

  

