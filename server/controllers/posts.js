/*
* posts Controller                                                                                                                          
* Created by ikoobmacpro on 2017.09.27..
* Copyright (c) 2017 ikoobmacpro. All rights reserved.
*/          

'use strict';

var Boom = require('boom'),
    Joi = require('joi');

//find all data    
exports.findAll = {
    description: '게시글 목록 조회',
    tags: ['api'],
    //auth: false,
    handler: function (request, reply) {
        Posts.find({})
            .exec(function (err, posts) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(posts);
            });
    }
};

//search data
exports.findAllSearch = {
    description: '게시글 검색',
    tags: ['api'],
    validate: {
        query: {
            type: Joi.string().valid('writerNickname', 'title', 'body').required(),
            keyword: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Posts.find({ [request.query.type]: '%' + request.query.keyword + '%' }) 
            .exec(function (err, posts) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(posts);
            });
    }
};



// find one data
exports.find = {
    description: '게시글 상세 조회',
    tags: ['api'],
    validate: {
        params: {
            postID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Posts.findOne({ id: request.params.postID })
            .exec(function (err, post) {
                if (err)
                    return reply(Boom.badImplementation(err));

                //게시글 조회수 ++
                post.visitCnt++;
                post.save();

                //이 게시물을 부모로 가지는 댓글 조회
                Comments.find({ parentID: post.id })
                    .exec(function (err, comments) {
                        if (err)
                            return reply(Boom.badImplementation(err));

                        //댓글 수정 삭제 권한 확인
                        for (var i = 0; i < comments.length; i++) {
                            //초기화
                            comments[i].deleteAndUpdate = 'impossible'

                            // 현재 유저아이디와 댓글의 작성자와 같으면
                            if (comments[i].writer == request.auth.userId)
                                comments[i].deleteAndUpdate = 'possible';
                        }

                        //게시글 수정 삭제 권한 확인
                        if (post.author == request.auth.userId)
                            reply({ "delete and update": "possible", "post": post, "comments": comments });
                        else
                            reply({ "delete and update": "impossible", "post": post, "comments": comments });
                    });


            });
    }
};

// create new data
exports.create = {
    description: '게시글 등록',
    tags: ['api'],
    validate: {
        payload: {
            title: Joi.string().required(),
            body: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {

        //현재 유저의 닉네임 찾기
        Users.findOne({ id: request.auth.userId })
            .exec(function (err, user) {
                if (err)
                    return reply(Boom.badImplementation(err));

                request.payload.writerNickname = user.nickname;

                //개시물 등록
                Posts.create(request.payload)
                    .exec(function (err, post) {
                        if (err) {
                            return reply(Boom.badImplementation(err));
                        }
                        reply(post);
                    });

            });


    }
};

// update data
exports.update = {
    description: '게시글 수정',
    tags: ['api'],
    validate: {
        params: {
            postID: Joi.string().required()
        },
        payload: {
            title: Joi.string().required(),
            body: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Posts.update({ id: request.params.postID }, request.payload)
            .exec(function (err, posts) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(posts);
            });
    }
};

// delete data
exports.destroy = {
    description: '게시글 삭제',
    tags: ['api'],
    validate: {
        params: {
            postID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Posts.destroy({ id: request.params.postID })
            .exec(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy');
            });
    }
};


// delete all data
exports.destroyAll = {
    description: '모든 게시글 삭제',
    tags: ['api'],
    //auth: false,
    handler: function (request, reply) {
        Posts.destroy({})
            .exec(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy all');
            });
    }
};