import Router from 'koa-router'
import axios from 'axios'
import query from '../../query'
import Jwt from '../../common/token'
import Result from '../../common/result'
import config from '../../config'
const router = new Router()

router.post('/', async ctx => {
    const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.miniapp.appid}&secret=${config.miniapp.secret}&js_code=${ctx.request.body.code}&grant_type=authorization_code`)

    if (res && res.data) {
        const user = await query(`select * from user where openid = '${res.data.openid}'`)

        if (user.length <= 0) {
            try {
                await query(`insert into user (openid,ismanage) values ('${res.data.openid}',0)`)
            } catch (err) {
                new Result(ctx).error('登录失败')
                return
            }
        }
        const token = new Jwt(res.data.openid).generateToken()

        new Result(ctx).success({ token }, '登录成功！')
    }
})

export default router