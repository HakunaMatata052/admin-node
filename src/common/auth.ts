// 鉴权
import Jwt from './token'
import Result from './result'
import { Next, ParameterizedContext } from 'koa'
import { JwtPayload } from 'jsonwebtoken'
import { getConnection } from 'typeorm'
import { User } from '../entity/User'
export const auth = async (ctx:ParameterizedContext, next:Next) => {
    try {
        const token = <string>ctx.headers.token
        const res = <JwtPayload> new Jwt(token).verifyToken()

        ctx.header.openid = res.token
        // eslint-disable-next-line callback-return
        await next()// 放行函数，继续往下走
    } catch (err) {
        new Result(ctx).error('token无效或登录已过期', 500)
    }
}

export const adminAuth = async (ctx:ParameterizedContext, next:Next) => {
    try {
        const user = await getConnection()
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('user.openid = :openid', {'openid': ctx.header.openid})
            .getOne()

        if (!user || !user.ismanage) {
            throw new Error('权限不足～')
        }
        // eslint-disable-next-line callback-return
        await next()// 放行函数，继续往下走
    } catch (err) {
        new Result(ctx).error(err.message, 500)
    }
}
