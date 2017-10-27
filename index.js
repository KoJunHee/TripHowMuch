'use strict';

var Boom = require('boom'),
    Config = require('./server/config'),
    fs = require('fs'),
    Hapi = require('hapi'),
    Moment = require('moment'),
    PackageInfo = require('./package.json'),
    Path = require('path'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    bell = require('bell'),
    server = new Hapi.Server();

server.connection(Config.server);

server.register([
    require('inert'),
    require('vision'),
    {
        register: require('hapi-swaggered'),
        options: {
            info: {
                title: PackageInfo.name,
                description: PackageInfo.description,
                version: PackageInfo.version
            },
            auth: false
        }
    },
    {
        register: require('hapi-swaggered-ui'),
        options: {
            title: PackageInfo.name,
            path: '/docs',
            authorization: { // see above
                field: 'authorization',
                scope: 'header',
                valuePrefix: 'bearer ',
                defaultValue: '## insert test token ##'
            },
            swaggerOptions: {
                validatorUrl: null
            },
            auth: false
        }
    },
    {
        register: require('hapi-auth-jwt')
    }], {
        select: 'api'
    }, function (err) {
        if (err) {
            throw err;
        }
    });


server.register([
    {
        // regist good : request console log
        register: require('good'),
        options: {
            ops: {
                interval: 1000
            },
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    }, {
        // regist samdasoo : A hapi plugin integrating Waterline ORM
        register: require('samdasoo'),
        options: {
            config: Config.database,
            migrate: 'safe',        // safe, drop, alter   
            //drop : 원래 있던 데이터 지웜 .. safe: 필드만 추가
            modelPath: Path.join(__dirname, '/server/models'),
            useGlobalModel: true
        }
    },
    {
        register: require('echo-request'),
        options: {
            params: true    //false로 하면 여러 로그가 찍힘 
        }
    }
], function (err) {
    // throw err
    // $lab:coverage:off$
    if (err) {
        throw err;
    }
    // $lab:coverage:on$

    // set auth
    server.auth.strategy('token', 'jwt', {
        key: 'app_server!!!',
        validateFunc: function (request, decodedToken, callback) {
            // Check token timestamp
            //console.log('decodedToken', decodedToken);
            var moment = new Moment(decodedToken.iat * 1000);
            var diff = moment.diff(moment);
            if (diff > 30 * 24 * 60 * 60 * 1000) { // 30 days
                return callback(null, false);
            }
            callback(null, true, decodedToken);
        }
    });
    server.auth.default('token');

    // before handler
    server.ext('onPostAuth', function (request, reply) {
        // print params
        server.plugins['echo-request'].echo(request);
        reply.continue();
    });

    // before handler
    server.ext('onPreHandler', function (request, reply) {
        // set userId
        //console.log(JSON.stringify(request.auth));
        if (request.auth.isAuthenticated && request.auth.credentials) {
            var credentials = null;
            if (_.isArray(request.auth.credentials)) {
                credentials = request.auth.credentials[0];
            } else {
                credentials = request.auth.credentials;
            }
            request.auth.userId = credentials.id;
        }
        reply.continue();
    });


    // route
    require('./server/routes')(server);


    // start server
    server.start(function () {
        // start log
        console.log('\x1b[32m>>\x1b[0m', Config.name + ' Server running at :', '\x1b[1m\x1b[32m' + server.info.uri + '\x1b[0m');
    });


});


module.exports = server;