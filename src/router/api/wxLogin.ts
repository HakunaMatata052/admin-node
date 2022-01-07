import Router from 'koa-router'
import axios from 'axios'
import Jwt from '../../common/token'
import Result from '../../common/result'
import config from '../../config'
import { getConnection } from 'typeorm'
import { User } from '../../entity/User'
const router = new Router()

router.post('/', async ctx => {
    const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.miniapp.appid}&secret=${config.miniapp.secret}&js_code=${ctx.request.body.code}&grant_type=authorization_code`)

    if (res && res.data) {
        const user = await getConnection()
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('openid = :openid', {'openid': res.data.openid})
            .getOne()

        if (!user) {
            const newUser = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([{
                    'openid': res.data.openid,
                    'ismanage': false,
                    'timestamp': new Date()
                }])
                .execute()
                .catch(()=>{
                    new Result(ctx).error('登录失败')
                })

            if (newUser){
                const token = new Jwt(res.data.openid).generateToken()

                new Result(ctx).success({ token }, '登录成功！')
            } else {
                new Result(ctx).error('登录失败')
            }
        } else {
            const token = new Jwt(res.data.openid).generateToken()

            new Result(ctx).success({ token }, '登录成功！')
        }
    }
})

export default router