'use strict';

var Boom = require('boom'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken');


//find all data
exports.findAll = {
    description: '유저 목록 조회',
    tags: ['api'],
    //auth: false,
    handler: function (request, reply) {
        Users.find({})
            .exec(function (err, users) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(users);
            });
    }
};

//find one data
exports.find = {
    description: '유저 상세 조회',
    tags: ['api'],
    validate: {
        params: {
            userID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Users.findOne({ id: request.params.userID })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};

//create new data
exports.create = {
    description: '유저 등록',
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),                                     
            nickname: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    auth: false,
    handler: function (request, reply) {
        Users.findOne({ email: request.payload.email })
            .exec(function (err, user) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                if (!user) {     //회원가입하려는 이메일이 존재 하지 않으면 생성                
                    Users.create(request.payload)
                        .exec(function (err, user) {
                            if (err) {
                                reply(Boom.badImplementation(err));
                            }
                            reply(user);
                        });
                }
                else
                    reply('user already exists');
            })
    }
};

// update data
exports.update = {
    description: '유저 수정',
    tags: ['api'],
    validate: {
        params: {
            userID: Joi.string().required()
        },
        payload: Joi.object({
            email: Joi.string().required(),
            nickname: Joi.string().required(),
            password: Joi.string().required()
        }).meta({ className: 'payload' })
    },
    //auth: false,
    handler: function (request, reply) {
        // 수정
        Users.update({ id: request.params.userID }, request.payload)
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(user);
            });
    }
};

//delete data
exports.destroy = {
    description: '유저 삭제',
    tags: ['api'],
    validate: {
        params: {
            userID: Joi.string().required()
        }
    },
    //auth: false,
    handler: function (request, reply) {
        Users.destroy({ id: request.params.userID })
            .exec(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy');
            });
    }
};

//delete all data
exports.destroyAll = {
    description: '모든 유저 삭제',
    tags: ['api'],
    //auth: false,
    handler: function (request, reply) {
        Users.destroy({})
            .exec(function (err) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                reply('destroy all');
            });
    }
};


//login
exports.loginJWT = {
    description: '로그인',
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    auth: {
        mode: 'try',
        strategy: 'token'
    },
    handler: function (request, reply) {
        Users.findOne({ email: request.payload.email })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                if (!user) {
                    return reply(Boom.unauthorized('invaild username'));
                }
                if (user.password === request.payload.password) {
                    var tokenData = {
                        nickname: user.nickname,
                        email: user.email,
                        id: user.id
                    };
                    var res = {
                        id: user.id,
                        nickname: user.nickname,
                        token: jwt.sign(tokenData, 'app_server!!!')
                    };
                    console.log("결과 : " + res.nickname);
                    reply(res);
                } else {
                    return reply(Boom.unauthorized('invaild password'));
                }
            });
    }
};
