'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async getUserByName(username) {
        const { app} = this;
        try {
             // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            return await app.mysql.get('user', {username});
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // 注册
    async register(params) {
        const {app} = this;
        try {
            return  await app.mysql.insert('user', params);
        }catch (e) {
            console.log(e)
            return null;
        }
    }
}

module.exports = UserService;