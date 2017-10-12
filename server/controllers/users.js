'use strict';

var Boom = require('boom'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),

    //facebook
    FacebookStrategy = require("passport-facebook"),
    facebookLogin = require("hapi-passport")(new FacebookStrategy({
        clientID: "2044409819105751",
        clientSecret: "6b7e9416e86b38c1f7075ed4d829f1fb",
        callbackURL: "http://localhost:8000/login/facebook",
        profileFields:['id','email','displayName']
    }, function verify(accessToken, refreshToken, profile, verified) {
        verified(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });
    }));

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
                    //password hashing
                    //10 : number of rounds to use when generating a salt
                    bcrypt.hash(request.payload.password, 10, function (err, hash) {
                        request.payload.password = hash;
                        //user 생성
                        Users.create(request.payload)
                            .exec(function (err, user) {
                                if (err) {
                                    reply(Boom.badImplementation(err));
                                }
                                reply(user);
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
    description: 'token 로그인',
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
                //login시 입력한 pwd hashing
                bcrypt.hash(request.payload.password, 10, function (err, hash) {
                    //password match check                    
                    bcrypt.compare(request.payload.password, hash, function (err, res) {
                        if (res) {
                            var tokenData = {
                                nickname: user.nickname,
                                email: user.email,
                                id: user.id
                            };
                            var res = {
                                // id: user.id,
                                // nickname: user.nickname,
                                token: jwt.sign(tokenData, 'app_server!!!')
                            };
                            reply(res);
                        } else {
                            //passwword not match
                            return reply(Boom.unauthorized('invaild password'));
                        }
                    })
                })
            });
    }
};


//facebook login
exports.loginFB = {
    description: 'facebook login',
    tags: ['api'],
    auth: false,
    handler: facebookLogin({
        onSuccess: function (info, request, reply) {
            // maybe do a redirect?
            reply(info);
            console.log(info);
        },
        onFailed: function (warning, request, reply) {
            // maybe show an error?
            reply(warning);
        },
        onError: function (error, request, reply) {
            // tell the world that you are angry.
            reply(error);
        }
    })
};