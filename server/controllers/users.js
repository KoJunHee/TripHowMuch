'use strict';

var Boom = require('boom'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    bell = require('bell');

//find all data
exports.findAll = {
    description: '유저 목록 조회',
    tags: ['api'],
    auth: false,
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
        //이메일 존재 여부 확인
        Users.findOne({ email: request.payload.email })
            .exec(function (err, user) {

                if (err)
                    reply(Boom.badImplementation(err));

                if (!user) {
                    bcrypt.hash(request.payload.password, 10, function (err, hash) {
                        request.payload.password = hash;
                        //user 생성
                        Users.create(request.payload)
                            .exec(function (err, user) {
                                if (err) {
                                    console.log('here :');
                                    reply(Boom.badImplementation(err));
                                }
                                //reply(user);
                            });
                    })
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
    auth: false,
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


//token login
exports.loginJWT = {
    description: '토큰 로그인',
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),
            password: Joi.string().required()   //사용자가 로그인시 입력한 비밀번호
        }
    },
    auth: {
        mode: 'try',
        strategy: 'token'
    },
    handler: function (request, reply) {
        //mail exist check
        Users.findOne({ email: request.payload.email })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                if (!user) {
                    return reply(Boom.unauthorized('invaild email'));
                }

                //로그인시 입력한 pwd,
                //디비에 저장된 hashing pwd
                //비교
                bcrypt.compare(request.payload.password, user.password, function (err, res) {

                    if (res) {
                        var tokenData = {
                            nickname: user.nickname,
                            email: user.email,
                            id: user.id
                        };
                        var res = {
                            token: jwt.sign(tokenData, 'app_server!!!')
                        };
                        reply(res);
                    } else {
                        //passwword not match
                        return reply(Boom.unauthorized('invaild password'));
                    }
                })
            })
    }
};

//facebook routing
exports.loginFB = {
    description: '페이스북 로그인',
    tags: ['api'],
    auth: 'facebook',
    handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        //authId가 유저 디비에 있는지 check
        Users.findOne({ authId: request.auth.credentials.profile.id })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                //디비에 등록되지 않은 유저라면
                if (!user) {
                    //유저 생성
                    var newUser = {
                        nickname: request.auth.credentials.profile.displayName,
                        authId: request.auth.credentials.profile.id
                    }
                    Users.create(newUser)
                        .exec(function (err, user) {
                            if (err) {
                                reply(Boom.badImplementation(err));
                            }
                            //토큰 부여
                            var tokenData = {
                                nickname: user.nickname,
                                email: user.email,
                                id: user.id
                            };
                            var res = {
                                token: jwt.sign(tokenData, 'app_server!!!')
                            };
                            reply(res);

                        });
                } else {
                    //등록된 유저라면
                    //토큰 부여
                    var tokenData = {
                        nickname: user.nickname,
                        email: user.email,
                        id: user.id
                    };
                    var res = {
                        token: jwt.sign(tokenData, 'app_server!!!')
                    };
                    reply(res);
                }
            });
    }
};


//google routing
exports.loginGG = {
    description: '구글 로그인',
    tags: ['api'],
    // config: {
    auth: 'google',
    handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }


        //authId가 유저 디비에 있는지 check
        Users.findOne({ authId: request.auth.credentials.profile.id })
            .exec(function (err, user) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                //디비에 등록되지 않은 유저라면
                if (!user) {
                    //유저 생성
                    var newUser = {
                        nickname: request.auth.credentials.profile.displayName,
                        authId: request.auth.credentials.profile.id,
                        email: request.auth.credentials.profile.email
                    }
                    Users.create(newUser)
                        .exec(function (err, user) {
                            if (err)
                                reply(Boom.badImplementation(err));

                            //토큰 부여                                            
                            var tokenData = {
                                nickname: user.nickname,
                                email: user.email,
                                id: user.id
                            }
                            var res = {
                                token: jwt.sign(tokenData, 'app_server!!!')
                            };
                            reply(res);
                        });
                } else {
                    //등록된 유저라면
                    //토큰 부여
                    var tokenData = {
                        nickname: user.nickname,
                        email: user.email,
                        id: user.id
                    }
                    var res = {
                        token: jwt.sign(tokenData, 'app_server!!!')
                    };
                    reply(res);
                }
            });
    }
    // }
};
