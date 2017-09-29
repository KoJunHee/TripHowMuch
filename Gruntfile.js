/* jshint -W097 */
'use strict';
var paths = {
    js: ['*.js', 'test/**/*.js', '!test/*', '!templates/*', '!node_modules/**']
};

module.exports = function (grunt) {

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // source watch
        watch: {
            js: {
                files: paths.js,
                tasks: [],
                options: {
                    livereload: true
                }
            }
        },
        // node daemon
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    args: [],
                    ignore: ['node_modules/**'],
                    ext: 'js',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        // excute concurrent nodemon and watch
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        lab: {
            color: true,
            coverage: true,
            minCoverage: 100
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }

    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    /**
     * Default Task
     */
    grunt.hook.push('concurrent', 9999);

    //Default task.
    grunt.registerTask('dev', ['hook']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'lab']);
};
