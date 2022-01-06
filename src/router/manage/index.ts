import Router from 'koa-router'
import login from './login'
import reg from './reg'
import goodsList from './goodsList'
import user from './user'
import category from './category'

const router = new Router()

// router.get('/', async ctx=>{
//     ctx.body = "管理系统"
// })

router.use('/login', login.routes(), login.allowedMethods())
router.use('/reg', reg.routes(), reg.allowedMethods())
router.use('/goodslist', goodsList.routes(), goodsList.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/category', category.routes(), category.allowedMethods())

export default router