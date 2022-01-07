
import Router from 'koa-router'
import { auth } from '../../common/auth'
import Result from '../../common/result'
import { getConnection } from 'typeorm'
import { User } from '../../entity/User'
const router = new Router()

router.get('/', auth, async ctx => {
    const userInfo = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('openid = :openid', {'openid': ctx.header.openid})
        .getOne()

    if (userInfo) {
        new Result(ctx).success({
            'username': userInfo[0].username,
            'avatar': userInfo[0].avatar,
            'roles': [userInfo[0].ismanage ? 'admin' : '']
        })
    } else {
        new Result(ctx).error()
    }
})
router.post('/update', auth, async ctx => {
    const { avatarUrl, nickName } = ctx.request.body

    if (!avatarUrl || !nickName) {
        new Result(ctx).error('昵称或头像错误')
        return
    }
    const res = await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({
            'username': nickName,
            'avatar': avatarUrl
        })
        .where('openid = :openid', {'openid': ctx.header.openid})
        .execute()
        .catch(()=>{
            new Result(ctx).error()
        })

    if (res){
        new Result(ctx).success(res)
    }
})

export default router