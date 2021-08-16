'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html',{
      title: '我是test页面'
    });
  }

  // 获取用户信息
  async user() {
    const {ctx} = this;
    const {name,slogen} = await ctx.service.home.user();
    ctx.body = {
      name,slogen
    };
  }

  // post 请求方法
  async add() {
    const {ctx} = this;
    const {title} = ctx.request.body;
    // Egg 框架内置了bodyParser 中间件来对POST请求body解析成object挂载到ctx.request.body上
    ctx.body = {
      title
    };
  }
}

module.exports = HomeController;
