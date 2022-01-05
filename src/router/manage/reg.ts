import Router from 'koa-router'
import md5 from 'md5'
import query from '../../query'
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
    const alreadyHaveUser = await query(`select * from user where username = '${ctx.request.body.username}'`)

    if (alreadyHaveUser && alreadyHaveUser.length === 0) {
        const res = await query(`insert into user (username,password,openid) values ('${ctx.request.body.username}','${md5(ctx.request.body.password)}','${md5(ctx.request.body.username)}')`).catch(() => {
            new Result(ctx).error('注册失败～')
        })

        if (res) {
            new Result(ctx).success(null, '注册成功！')
        }
    } else {
        new Result(ctx).error('账号已存在！')
    }

})

export default router