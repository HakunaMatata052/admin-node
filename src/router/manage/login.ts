import Router from 'koa-router'
import md5 from 'md5'
import query from '../../query'
import Jwt from '../../common/token'
import Result from '../../common/result'
const router = new Router()

router.post('/', async ctx => {
    if (!ctx.request.body.username || ctx.request.body.username.length < 3 || ctx.request.body.username.length > 8) {
        new Result(ctx, '请填写正确的用户名', 0)
        return
    }
    if (!ctx.request.body.password || ctx.request.body.password.length <= 0 || ctx.request.body.password.length > 16) {
        new Result(ctx, '请填写正确的密码', 0)
        return
    }

    const user = await query(`select * from user where username = '${ctx.request.body.username}' and password = '${md5(ctx.request.body.password)}' `)

    if (user.length > 0) {
        const token = new Jwt(user[0].openid).generateToken()

        new Result(ctx, '登录成功！', 200, {
            token
        })
    } else {
        new Result(ctx, '账号或密码错误～', 0)
    }
})

export default router