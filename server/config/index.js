var config = {
    name: 'API',
    server: {
        host: '192.168.1.182',
        port: 8000,
        labels: ['api'],
        routes:{
            cors:true
        }
    },
    database: {
        mongo: {
            host: 'ds141464.mlab.com',
            username: 'junhee.ko',
            password: 'qq1212qq1212!',
            port: '41464',
            database: 'web_practice'
        }
    }
};

module.exports = config;

