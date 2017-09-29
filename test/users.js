'use strict';

var Code = require('code');
var Lab = require('lab');
var LabScript = exports.lab = Lab.script();

var Server = require('../');

var experiment = LabScript.experiment;
var test = LabScript.test;
var before = LabScript.before;
var after = LabScript.after;
var expect = Code.expect;

/*
 before(), after(), beforeEach(), afterEach()
 */

experiment('Users ', { timeout: 1000 }, function () {
    before(function (done) {
        // 서버 plugin 및 routes 가 모두 로드 되면 done 처리
        Server.on('pluginsLoaded', done);
    });

    var user = {};

    test('Post user', function (done) {
        // 테스트 api
        var options = {
            method: 'POST',
            url: '/users',
            payload: {
                firstName: 'Test',
                lastName: 'User'
            }
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            user = result;
            expect(result.firstName).to.equal('Test');
            expect(result.lastName).to.equal('User');
            expect(result.id).not.empty();
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    test('Get user list', function (done) {
        // 테스트 api
        var options = {
            method: 'GET',
            url: '/users'
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result.length).to.equal(1);
            expect(response.statusCode).to.equal(200);
            expect(result).to.not.be.an.instanceof(Error);
            done();
        });
    });

    test('Get user by id', function (done) {
        // 테스트 api
        var options = {
            method: 'GET',
            url: '/users/' + user.id
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result.firstName).to.equal('Test');
            expect(result.lastName).to.equal('User');
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    test('Update user by id', function (done) {
        // 테스트 api
        var options = {
            method: 'PUT',
            url: '/users/' + user.id,
            payload: {
                firstName: 'Test 1',
                lastName: 'User 2'
            }
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result.firstName).to.equal('Test 1');
            expect(result.lastName).to.equal('User 2');
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    test('Get user by id', function (done) {
        // 테스트 api
        var options = {
            method: 'GET',
            url: '/users/' + user.id
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result.firstName).to.equal('Test 1');
            expect(result.lastName).to.equal('User 2');
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    test('Delete user by id', function (done) {
        // 테스트 api
        var options = {
            method: 'DELETE',
            url: '/users/' + user.id
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result).to.equal('destroy');
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    test('Get user list', function (done) {
        // 테스트 api
        var options = {
            method: 'GET',
            url: '/users'
        };

        Server.inject(options, function (response) {
            // 처리 결과
            var result = response.result;
            expect(result.length).to.equal(0);
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


// 업로드 테스트 참고
//
//lab.experiment('Upload a photo', function () {
//
//    var image = {
//        name: 'Ren & Stimpy',
//        description: [
//            'Ren Höek is a hot-tempered, "asthma-hound" Chihuahua.',
//            'Stimpson "Stimpy" J. Cat is a three-year-old dim-witted and happy-go-lucky cat.'
//        ].join('\n'),
//        filename: 'ren.jpg',
//        checksum: '5965ae98ecab44a2a29b87f90c681229',
//        width: 256,
//        height: 256,
//        filedata: new Buffer('lets imagine that this is an image')
//    };
//
//    lab.test('Should accept a multipart/form-data request', function (done) {
//
//        var form = new FormData();
//
//        // Fill the form object
//        Object.keys(image).forEach(function (key) {
//            form.append(key, image[key]);
//        });
//
//        streamToPromise(form).then(function (payload) {
//
//            server.inject({
//                url: '/photos',
//                method: 'POST',
//                headers: form.getHeaders(),
//                payload: payload
//            }, function (response) {
//                var result = response.result;
//
//                Code.expect(response.statusCode).to.equal(200);
//                Code.expect(result.name).to.equal(image.name);
//                Code.expect(result.description).to.equal(image.description);
//                Code.expect(result.filename).to.equal(image.filename);
//                Code.expect(result.checksum).to.equal(image.checksum);
//                Code.expect(result.width).to.equal(image.width);
//                Code.expect(result.height).to.equal(image.height);
//
//                done();
//            });
//
//        });
//    });
//
//    lab.test('Should accept a text/json request', function (done) {
//
//        // Convert the image buffer to a base64 string
//        image.filedata = image.filedata.toString('base64');
//
//        server.inject({
//            url: '/photos',
//            method: 'POST',
//            payload: image
//        }, function (response) {
//            var result = response.result;
//
//            Code.expect(response.statusCode).to.equal(200);
//            Code.expect(result.name).to.equal(image.name);
//            Code.expect(result.description).to.equal(image.description);
//            Code.expect(result.filename).to.equal(image.filename);
//            Code.expect(result.checksum).to.equal(image.checksum);
//            Code.expect(result.width).to.equal(image.width);
//            Code.expect(result.height).to.equal(image.height);
//
//            done();
//        });
//
//    });
//});