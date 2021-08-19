'use strict';

const Controller = require('egg').Controller;
// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
    async register() {
        const {ctx} = this;
        const {username,password} = ctx.request.body; // 获取注册需要的参数
        // 判空惭怍
        if(!username || !password){
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null
            }
            return
        }
        // 验证数据库是否已经有该用户
        const userInfo = await ctx.service.user.getUserByName(username);
        if(userInfo && userInfo.id){
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return
        }
        // 调用service方法，将数据存入数据库
        const result = await ctx.service.user.register({
            username,
            password,
            signature: 'Anything is possible!',
            avatar: defaultAvatar,
            ctime: +new Date()
        });
        if(result){
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        }else{
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }
}

module.exports = UserController;
