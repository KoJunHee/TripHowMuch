/*
* pictures Controller
* Created by ikoobmacpro on 2017.10.10..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var Boom = require('boom'),
    Joi = require('joi');

//find all data    
exports.findAll = {
    description: '사진 목록 조회',
    tags: ['api'],
    //auth: false,
    handler: function (request, reply) {
        // 전체 조회
        Pictures.find({})
            .exec(function (err, pictures) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(pictures);
            });
    }
};

// find data
exports.find = {
    description: '사진 상세 조회 : 현재 유저와 사진 올린 사람 같으면 수정 삭제 가능',
    tags: ['api'],
    validate: {
        params: {
            picturesId: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {


        //현재 유저의 닉네임 찾기
        Users.findOne({ id: request.auth.userId })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                // 조회
                Pictures.findOne({ id: request.params.picturesId })
                    .exec(function (err, pictures) {
                        // 결과
                        if (err) {
                            return reply(Boom.badImplementation(err));
                        }

                        //현재 유저의 닉네임과 사진올린 유저의 닉네임이 같으면
                        //수정 삭제 가능
                        if (user.nickname == pictures.writerNickname)
                            pictures.deleteAndUpdate = "possible"

                        //사진 조회수 ++
                        pictures.viewCnt++;
                        pictures.save();

                        reply(pictures);
                    });




            });
























    }
};

// create new data
exports.create = {
    description: '사진 등록',
    tags: ['api'],
    validate: {
        payload: {
            base64: Joi.string().required(),
            title: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {

        //현재 유저의 닉네임 찾기
        Users.findOne({ id: request.auth.userId })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                request.payload.writerNickname = user.nickname;

                // 생성
                Pictures.create(request.payload)
                    .exec(function (err, pictures) {
                        // 결과
                        if (err) {
                            return reply(Boom.badImplementation(err));
                        }

                        reply(pictures);
                    });
            });
    }
};

// update data
exports.update = {
    description: '사진 수정',
    tags: ['api'],
    validate: {
        params: {
            picturesId: Joi.string().required()
        },
        payload: {
            base64: Joi.string().required(),
            title: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 수정
        Pictures.update({ id: request.params.picturesId }, request.payload)
            .exec(function (err, pictures) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(pictures);
            });
    }
};

// delete data
exports.destroy = {
    description: '사진 삭제',
    tags: ['api'],
    validate: {
        params: {
            picturesId: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 삭제
        Pictures.destroy({ id: request.params.picturesId })
            .exec(function (err) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy');
            });
    }
}; 