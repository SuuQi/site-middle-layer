// 所有的错误统一处理
export default function () {
    return async function errorHandler (ctx, next) {
        try {
            await next();
        } catch (e) {
            ctx.app.emit('error', e, ctx);
        }
    }
}
