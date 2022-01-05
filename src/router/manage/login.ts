import Router from 'koa-router'
import md5 from 'md5'
import query from '../../query'
import Jwt from '../../common/token'
import Result from '../../common/result'
const router = new Router()

router.post('/', async ctx => {
    if (!ctx.request.body.username || ctx.request.body.username.length < 3 || ctx.request.body.username.length > 8) {
        new Result(ctx).error('请填写正确的用户名')
        return
    }
    if (!ctx.request.body.password || ctx.request.body.password.length <= 0 || ctx.request.body.password.length > 16) {
        new Result(ctx).error('请填写正确的密码')
        return
    }

    const user = await query(`select * from user where username = '${ctx.request.body.username}' and password = '${md5(ctx.request.body.password)}' `)

    if (user.length > 0) {
        const token = new Jwt(user[0].openid).generateToken()

        new Result(ctx).success({token}, '登录成功')
    } else {
        new Result(ctx).error('账号或密码错误～')
    }
})

export default router