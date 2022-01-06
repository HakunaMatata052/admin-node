import Router from 'koa-router'
import md5 from 'md5'
import { getConnection} from 'typeorm'
import Result from '../../common/result'
import { User } from '../../entity/User'
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
    const alreadyHaveUser = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.username = :username', {'username': ctx.request.body.username})
        .getOne()
    const {username, password} = ctx.request.body

    if (!alreadyHaveUser) {
        const res = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([{
                username,
                'password': md5(password),
                'openid': md5(username),
                'timestamp': Date()
            }])
            .execute()

        if (res) {
            new Result(ctx).success([], '注册成功！')
        } else {
            new Result(ctx).error('注册失败～')
        }
    } else {
        new Result(ctx).error('账号已存在！')
    }

})

export default router