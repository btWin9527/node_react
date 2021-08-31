'use strict';

const Controller = require('egg').Controller;

const TYPE = [

        {id: 11, name: '工资',type: 1},
        {id: 12, name: '奖金',type: 1},
        {id: 13, name: '转账',type: 1},
        {id: 14, name: '理财',type: 1},
        {id: 15, name: '退款',type: 1},
        {id: 16, name: '其他',type: 1},
        {id: 1, name: '餐饮',type: 2},
        {id: 2, name: '服饰',type: 2},
        {id: 3, name: '交通',type: 2},
        {id: 4, name: '日用',type: 2},
        {id: 5, name: '购物',type: 2},
        {id: 6, name: '学习',type: 2},
        {id: 7, name: '医疗',type: 2},
        {id: 8, name: '旅行',type: 2},
        {id: 9, name: '人情',type: 2},
        {id: 10, name: '其他',type: 2}
    ];


class TypeService extends Controller {
    list() {
        const {ctx, app} = this;
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                list: TYPE
            }
        }
    }
}

module.exports = TypeService;