
import Router from 'koa-router'
import query from '../../query'
import { auth } from '../../common/auth'
import Result from '../../common/result'
const router = new Router()

router.get('/', auth, async ctx => {
    const userInfo = await query(`select * from user where openid = '${ctx.header.openid}'`)

    if (userInfo.length > 0) {
        new Result(ctx, '', 200, {
            'username': userInfo[0].username,
            'avatar': userInfo[0].avatar,
            'roles': [userInfo[0].ismanage ? 'admin' : '']
        })
    }
})
router.post('/update', auth, async ctx => {
    const { avatarUrl, nickName } = ctx.request.body

    if (!avatarUrl || !nickName) {
        new Result(ctx).error('昵称或头像错误')
        return
    }
    const res = await query(`update user set username = '${nickName}' , avatar = '${avatarUrl}' where openid = '${ctx.header.openid}'`)

    if (res) {
        new Result(ctx)
    }
})

export default router