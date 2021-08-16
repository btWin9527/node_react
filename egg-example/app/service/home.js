'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
    async user() {
        const {ctx, app} = this;
        const QUERY_STY = 'id, name';
        let sql = `select ${QUERY_STY} from list`; // 获取 id 的 sql 语句
        try {
             // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            return await app.mysql.query(sql);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

module.exports = HomeService;