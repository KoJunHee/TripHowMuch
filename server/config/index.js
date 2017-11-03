var config = {
    name: 'API',
    server: {
        host: 'host',
        port: port,
        labels: ['api'],
        routes: {
            cors: { credentials: 'true' }
        }
    },
    openApi: {
        baseUrl: 'baseUrl',
        myKey: 'myKey'
    },
    database: {
        mongo:
        {
            host: 'host',
            username: 'username',
            password: 'password',
            port: 'port',
            database: 'database'
        }
    }
};


module.exports = config;