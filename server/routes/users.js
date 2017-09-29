'use strict';

var Controller = require('../controllers/users');

module.exports = [
    { method: 'GET', path: '/users', config: Controller.findAll },  //index
    { method: 'GET', path: '/users/{userID}', config: Controller.find },    //show
    { method: 'POST', path: '/users', config: Controller.create },  //create
    { method: 'PUT', path: '/users/{userID}', config: Controller.update },  //update
    { method: 'DELETE', path: '/users/{userID}', config: Controller.destroy },   //destroy
    { method: 'DELETE', path: '/users', config: Controller.destroyAll },   //destroyAll    
    { method: 'POST', path: '/login', config: Controller.loginJWT } //login
];
