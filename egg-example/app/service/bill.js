'use strict';

const Service = require('egg').Service;

class BillService extends Service {
    // 添加账单
    async add(params) {
        const {ctx, app} = this;
        try {
            // 往bill表中，插入一条账单数据
            return await app.mysql.insert('bill', params);
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    // 获取账单列表
    async list(id) {
        const {ctx, app} = this;
        const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
        let sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
        try {
            return await app.mysql.query(sql)
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async detail(id, user_id) {
        const {ctx, app} = this;
        try {
            return await app.mysql.get('bill', {id, user_id})
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async update(params) {
        const {ctx, app} = this;
        try {
            return await app.mysql.update('bill', {
                ...params
            }, {
                id: params.id,
                user_id: params.user_id
            });
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async delete(id, user_id) {
        const {ctx, app} = this;
        try {
            return await app.mysql.delete('bill', {
                id,
                user_id
            });
        } catch (e) {
            return null;
        }
    }
}

module.exports = BillService;