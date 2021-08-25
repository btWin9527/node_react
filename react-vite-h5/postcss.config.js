// 用 vite 创建项目，配置 postcss 需要使用 post.config.js，之前使用的 .postcssrc.js 已经被抛弃
module.exports = {
    "plugins": [
        require("postcss-pxtorem")({
            rootValue: 37.5, // 若设计稿为375px即设置37.5,如果设计稿为750,则设置75
            propList: ['*'],
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        })
    ]
}