import Router from 'koa-router'
import md5 from 'md5'
import query from '../../common/query'
import { auth, adminAuth } from '../../common/auth'
import Result from '../../common/result'
const router = new Router()

router.get('/', auth, adminAuth, async ctx => {
    const userInfo = await query(`select * from user where openid = '${ctx.header.openid}'`)

    if (userInfo.length > 0 && userInfo[0].ismanage) {
        const user = await query(`select * from user where id = '${ctx.request.query.id}'`)

        if (user.length) {
            new Result(ctx, '', 200, {
                'id': user[0].id,
                'avatar': user[0].avatar,
                'username': user[0].username,
                'ismanage': user[0].ismanage,
                'timestamp': user[0].timestamp
            })
        } else {
            new Result(ctx, '用户不存在', 0)
        }
    } else {
        new Result(ctx, '你没有权限', 0)
    }
})

router.post('/', auth, adminAuth, async ctx => {
    console.log(2)
    const userInfo = await query(`select * from user where openid = '${ctx.header.openid}'`)

    if (userInfo.length > 0 && userInfo[0].ismanage) {
        if (ctx.request.body.password.length > 0) {
            if (ctx.request.body.password.length > 16) {
                new Result(ctx, '请填写正确的密码', 0)
                return
            }
            await query(`update user set password = '${md5(ctx.request.body.password)}' where id = '${ctx.request.body.id}'`)

        }
        const user = await query(`update user set avatar = '${ctx.request.body.avatar}',username = '${ctx.request.body.username}',ismanage = '${ctx.request.body.ismanage}' where id = '${ctx.request.body.id}'`)

        if (user) {
            new Result(ctx, '修改成功')
        } else {
            new Result(ctx, '用户不存在', 0)
        }
    } else {
        new Result(ctx, '你没有权限', 0)
    }
})

router.get('/list', auth, adminAuth, async ctx => {
    const userList = await query('select * from user')

    new Result(ctx, '', 200, {
        'list': userList.map(item => {
            return {
                ...item,
                'roles': [item.ismanage ? 'admin' : '']
            }
        })
    })
})

export default router