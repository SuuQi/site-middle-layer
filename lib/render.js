import path from 'path';
import ejs from 'ejs';

/**
 * 根据配置返回一个ejs的渲染函数
 * @param  {Object} options ejs配置，参考：https://github.com/mde/ejs
 * @return {Function}       渲染函数
 */
export default function (options) {
    const opts = options;

    return function (filename, data = {}, _options = {}) {
        const ctx = this;

        return new Promise((resolve, reject) => {
            // 和客户端的ejs区分开啦，默认的定界符用$
            const _opts = Object.assign({ delimiter: '$' }, opts, _options);

            // 文件根据配置的root查找
            ejs.renderFile(path.join(_opts.root, filename), data, _opts, (err, str) => {
                if (err) {
                    ctx.throw(404, err);
                    return resolve();
                }

                ctx.type = 'html';
                ctx.body = str;
                resolve();
            });
        });
    }
}
