import Router from 'koa-router'
import { auth } from '../../common/auth'
import Result from '../../common/result'
const router = new Router()

router.get('/', auth, async ctx => {
    new Result(ctx, '成功')
})

export default router