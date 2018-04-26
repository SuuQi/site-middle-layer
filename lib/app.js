import URL from 'url';
import Koa from 'koa';

import errorHandler from './middleware/errorHandler.js';
import proxy from './proxy.js';
import render from './render.js';

/**
 * 启动app
 * @param  {Object}   opts               配置
 * @param  {Object}   opts.router        koa-router实例，路由中间件
 * @param  {Object}   opts.static        静态目录配置，不传则不会添加静态目录中间件
 * @param  {String}   opts.render        ejs模板引擎配置，参考：https://github.com/mde/ejs
 * @param  {Object}   opts.proxy         代理配置
 */
export default function (opts) {
    const app = new Koa();

    if (opts.proxy) {
        app.context.proxy = proxy(opts.proxy);
    }

    if (opts.render) {
        app.context.render = render(opts.render);
    }

    if (opts.static) {
        app.use(require('koa-static')(opts.static.root, opts.static));
    }

    // 添加日志
    // 压缩
    // 实体解析
    app.use(require('koa-logger')());
    app.use(require('koa-compress')());
    app.use(require('koa-better-body')({
        querystring: require('qs')
    }));

    // 统一的错误处理
    app.use(errorHandler());

    // 添加路由
    app.use(opts.router.routes());
    app.use(opts.router.allowedMethods());

    if (opts.proxy) {
        // 没有注册的路由，直接走代理
        app.use(async (ctx, next) => {
            await ctx.proxy({ url: ctx.url, needPipeRes: true }, ctx);
        });
    }

    app.on('error', err => console.error('server error: ', err));
    process.on('unhandledRejection', err => console.log('unhandledRejection: ', err));

    return app;
}
