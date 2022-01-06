// 鉴权
import Jwt from './token'
import query from './query'
import Result from './result'
import { Next, ParameterizedContext } from 'koa'
import { JwtPayload } from 'jsonwebtoken'
export const auth = async (ctx:ParameterizedContext, next:Next):Promise<null> => {
    try {
        const token = <string>ctx.headers.token
        const res = <JwtPayload> new Jwt(token).verifyToken()

        ctx.header.openid = res.token
    } catch (err) {
        // try中报错就会走catch，
        ctx.body = {
            'code': 500,
            'msg': 'token无效或登录已过期'
        }
    }
    return await next()// 放行函数，继续往下走
}

export const adminAuth = async (ctx:ParameterizedContext, next:Next):Promise<null> => {
    try {
        const userInfo = await query(`select * from user where openid = '${ctx.header.openid}'`)

        if (!userInfo.length || !userInfo[0].ismanage) {
            throw new Error()
        }
    } catch (err) {
        // try中报错就会走catch，
        new Result(ctx, '权限不足', 501)
    }
    return await next()// 放行函数，继续往下走
}
