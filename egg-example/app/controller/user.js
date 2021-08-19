'use strict';

const Controller = require('egg').Controller;
// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
    async register() {
        const {ctx} = this;
        const {username, password} = ctx.request.body; // 获取注册需要的参数
        // 判空惭怍
        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null
            }
            return
        }
        // 验证数据库是否已经有该用户
        const userInfo = await ctx.service.user.getUserByName(username);
        if (userInfo && userInfo.id) {
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
        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }

    async login() {
        // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
        const {ctx, app} = this;
        const {username, password} = ctx.request.body;
        // 根据用户名，在数据库查找对应的id操作
        const userInfo = await ctx.service.user.getUserByName(username)
        // 没找到说明没有该用户
        if (!username || username.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return
        }
        // 找到用户，并且判断输入密码与数据库中用户密码不匹配时
        if (userInfo && password != userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return
        }
        // 生成token加盐
        // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        }, app.config.jwt.secret);
        ctx.body = {
            code: 200,
            message: '登录成功',
            data: {
                token
            }
        }
    }

    // 验证方法
    async test() {
        const {ctx, app} = this;
        // 通过token解析，拿到user_id
        const token = ctx.request.header.authorization;
        // 通过app.jwt.verify + 加密字符串解析出token的值
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        // 接口响应
        ctx.body = {
            code: 200,
            message: '获取成功',
            data: {
                ...decode
            }
        }
    }
}

module.exports = UserController;
