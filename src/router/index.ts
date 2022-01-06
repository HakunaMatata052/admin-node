import Router from 'koa-router'
import manage from './manage'
import api from './api'
import errorPage from './other/errorPage'
const router = new Router()

// 404页面路由
router.use('/404', errorPage.routes(), errorPage.allowedMethods())
// 后台地址
router.use('/manage', manage.routes(), manage.allowedMethods())
// 前台地址
router.use('/api', api.routes(), api.allowedMethods())

router.redirect('/', '/api')
export default router