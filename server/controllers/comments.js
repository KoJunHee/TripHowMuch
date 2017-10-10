/*
* comments Controller
* Created by ikoobmacpro on 2017.09.28..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/

'use strict';

var Boom = require('boom'),
    Joi = require('joi');

//find all data
exports.findAll = {
    description: '전체 댓글 목록 조회',
    tags: ['api'],
    auth: false,
    handler: function (request, reply) {
        // 전체 조회
        Comments.find({})
            .exec(function (err, comments) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(comments);
            });
    }
};

//find more data
exports.findMore = {
    description: '대댓글 조회',
    tags: ['api'],
    validate: {
        params: {
            commentID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 조회
        Comments.find({ parentID: request.params.commentID })
            .exec(function (err, comments) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                //대댓글 수정 삭제 권한 확인
                for (var i = 0; i < comments.length; i++) {
                    //초기화
                    comments[i].deleteAndUpdate = 'impossible'

                    // 현재 유저아이디와 댓글의 작성자와 같으면
                    if (comments[i].writer == request.auth.userId)
                        comments[i].deleteAndUpdate = 'possible';
                }
                reply(comments);
            });
    }
};

// find one data
exports.find = {
    description: '댓글 상세 정보 조회',
    tags: ['api'],
    validate: {
        params: {
            commentID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 조회
        Comments.findOne({ id: request.params.commentID })
            .exec(function (err, comment) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(comment);
            });
    }
};

// create new data under post
exports.createUnderPost = {
    description: '댓글 등록_게시글 밑에',
    tags: ['api'],
    validate: {
        payload: {
            content: Joi.string().required(),
            parentID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        request.payload.writer = request.auth.userId;   //댓글 작성자
        request.payload.parent = 'post';    //댓글의 부모
        console.log(request.payload);

        // 생성
        Comments.create(request.payload)
            .exec(function (err, comment) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(comment);
            });
    }
};

//create new data under comment
exports.createUnderComment = {
    description: '댓글 등록_댓글 밑에',
    tags: ['api'],
    validate: {
        payload: {
            content: Joi.string().required(),
            parentID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        request.payload.writer = request.auth.userId;   //댓글 작성자 = 현재 유저 아이디
        request.payload.parent = 'comment';    //댓글의 부모
        console.log("use id : " + request.auth.userId);

        // 생성
        Comments.create(request.payload)
            .exec(function (err, comment) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(comment);
            });
    }
};

// update data
exports.update = {
    description: '댓글 수정',
    tags: ['api'],
    validate: {
        params: {
            commentID: Joi.string().required()
        },
        payload: {
            content: Joi.string().required(),
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 수정
        Comments.update({ id: request.params.commentID }, request.payload)
            .exec(function (err, comment) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(comment);
            });
    }
};

// delete data
exports.destroy = {
    description: '댓글 삭제',
    tags: ['api'],
    validate: {
        params: {
            commentID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        // 삭제
        Comments.destroy({ id: request.params.commentID })
            .exec(function (err) {
                // 결과
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy');
            });
    }
};