import Router from 'koa-router'
import Result from '../../common/result'
import wxLogin from './wxLogin'
import userInfo from './userInfo'
const router = new Router()

router.get('/', async (ctx)=>{
    new Result(ctx)
})

router.use('/wxlogin', wxLogin.routes(), wxLogin.allowedMethods())
router.use('/userinfo', userInfo.routes(), userInfo.allowedMethods())

export default router
