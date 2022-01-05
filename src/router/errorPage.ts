import Router from 'koa-router'
const errorPage:Router = new Router()

errorPage.get('/', async (ctx) => {
    ctx.body = '访问页面不存在'
})

export default errorPage