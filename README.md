# api_server 
REST api 서버 프레임워크 

## 시작하기
```
$ git clone http://gitlab.ikoob.com/server/api_server.git test_project

$ cd test_project

$ rm -rf .git

$ git init

$ npm install
```

### 설정
* server/config/index.js

```
var config = {
    name: 'API',
    server: {
        host: 'localhost',
        port: 8000
    },
    database: {
        mongo: {
            host: 'localhost',
            port: '27017',
            username: 'username',
            password: 'password',
            database: 'api_dev'
        }
    }
};

if (process.env.NODE_MODE == 'production') {
    config = {
        server: {
            host: process.env.NODE_HOST,
            port: process.env.NODE_PORT
        },
        database: {
            mongo: {
                host: process.env.NODE_HOST,
                port: process.env.MONGODB_PORT,
                username: process.env.MONGO_USER,
                password: process.env.MONGODB_PW,
                database: 'api'
            }
        }
    };
}

module.exports = config;
```
## test
```
$ npm test
```

## samdasoo 사용법
* plugin 등록

```
server.register({
    register: require('samdasoo'),
    options: {
        config: config.database,
        migrate: 'drop',
        modelPath: __dirname + '/server/models'
}, function(err){
    if (err) {
        throw  err;
    }
});
```
* samdasoo model 생성

```
$ sudo npm install -g samdasoo  // global 설치

$ smds -a users

[Support Database]
0. exit
1. disk
2. memory
3. mongo
4. mysql
5. postgresql
6. redis
7. sqlserver
 Select Database (1-8): :  3
# Select mongo

>> create /Users/yeobster/Documents/workspace/Server/cfm/server/models/users.js

>> create /Users/yeobster/Documents/workspace/Server/cfm/server/routes/users.js

>> create /Users/yeobster/Documents/workspace/Server/cfm/server/controllers/users.js

## node restart ##

```

## 문서화
API document : http://서버주소:포트/docs

## 참고자료
* [hapijs](http://hapijs.com/)
* [joi](https://github.com/hapijs/joi)
* [waterline](https://github.com/balderdashy/waterline) [Documentation](https://github.com/balderdashy/waterline-docs)
* [boom](https://github.com/hapijs/boom)
* [samdasoo](https://www.npmjs.com/package/samdasoo)
* [echo-request](https://www.npmjs.com/package/echo-request)
* [lout](https://github.com/hapijs/lout)
* [lodash](https://lodash.com)
* [good](https://github.com/hapijs/good)
* [good-console](https://github.com/hapijs/good-console)

## TODO
- 문서 정리
- 쉽고, 자동화된 배포 - Hot Deploy
- 재사용성

## License
Copyright (c) 2015 yeop.hyun  
Licensed under the MIT license.