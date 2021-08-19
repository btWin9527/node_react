/* eslint valid-jsdoc: "off" */

'use strict';

const {mysql} = require("./plugin");
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.security = {
    csrf : {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: [ '*' ], // 配置白名单
  }

  config.view = {
    mapping: {'.html': 'ejs'}  //左边写成.html后缀，会自动渲染.html文件
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628065346518_5004';

  // add your middleware config here
  config.middleware = [];

  config.jwt = {
    secret: 'Nick',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  exports.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'administrator', // 初始化密码，没设置的可以不写
      // 数据库名
      database: 'test', // 我们新建的数据库名称
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }

  return {
    ...config,
    ...userConfig,
  };
};
