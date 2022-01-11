import {Context, Next} from 'koa'
import Result from './result'
export const error = async (ctx:Context, next:Next):Promise<void>=>{
    try {
        // eslint-disable-next-line callback-return
        await next()
    } catch (err){
        console.log('全局错误捕获', err)
        new Result(ctx).error(err.message || '服务器忙碌，请稍后再试～')
    }
}
