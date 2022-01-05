import Router from 'koa-router'
import md5 from 'md5'
import query from '../../query'
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
    const alreadyHaveUser = await query(`select * from user where username = '${ctx.request.body.username}'`)

    if (alreadyHaveUser && alreadyHaveUser.length === 0) {
        const res = await query(`insert into user (username,password,openid) values ('${ctx.request.body.username}','${md5(ctx.request.body.password)}','${md5(ctx.request.body.username)}')`).catch(() => {
            new Result(ctx, '注册失败～', 0)
        })

        if (res) {
            new Result(ctx, '注册成功！', 200)
        }
    } else {
        new Result(ctx, '账号已存在！', 0)
    }

})

export default router