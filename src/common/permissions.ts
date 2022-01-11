import {Context, Next} from 'koa'
import Result from './result'

export const permissions = async (ctx: Context, next:Next):Promise<void>=>{
    if (ctx.state.user.ismanage){
        await next()
    } else {
        new Result(ctx).error('权限不足')
    }
}