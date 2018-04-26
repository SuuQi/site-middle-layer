import URL from 'url';

const DEFAULT_OPTS = {
    gzip: true,
    timeout: 15000
};

// 参考： https://github.com/xiongwilee/koa-grace/blob/master/middleware/proxy/lib/request.js
/**
 * 向其他服务器发起请求，如果请求以/开头，则向提供api的服务器发起请求
 * @param  {Object} opts 请求的配置，详细请见：https://github.com/request/request
 * @param {Boolean} opts.needPipeRes 这个额外的配置，表示请求的返回是否使用pipe，返回数据量大且无须再处理时使用
 * @return {Promise}     返回promise
 */
function proxy (opts, ctx = this) {
    const options = Object.assign({}, DEFAULT_OPTS, opts);
    const startTime = new Date();

    // 如果url是以/开头，需要加上代理域名
    if (options.url.match(/^\//)) {
        options.url = opts.target + options.url;
    }

    // 访问目标服务器
    // 将cookie带上
    if (options.url.indexOf(opts.target) === 0) {
        options.headers || (options.headers = {});
        options.headers.Cookie = ctx.headers.cookie;
    }

    return new Promise((resolve, reject) => {
        const proxyRequest = request(options, (err, res = {}, data) => {
            const duration = `${new Date() - startTime}ms`;

            if (err) {
                err.status = res.status;
                err.duration = duration;
                console.error(err);
                reject(`proxy error: ${options.url}`);
                return;
            }

            if (data || ctx.method === 'HEAD') {
                try {
                    data = JSON.parse(data);
                } catch (e) {}

                resolve({ res, data });
                return;
            }
        });

        if (ctx.req.readable && ctx.method !== 'GET') {
            ctx.req.pipe(proxyRequest);
        }

        if (opts.needPipeRes) {
            proxyRequest.pipe(ctx.res);
        }
    });
}

export default function (options = {}) {
    const opts = options;

    return function (_options) {
        return proxy.call(this, Object.assign({}, opts, _options));
    }
}
