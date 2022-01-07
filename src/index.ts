import Koa from 'koa'
import path from 'path'
import bodyParser from 'koa-bodyparser' // 处理body
import cors from 'koa2-cors' // 跨域
import config from './config' // 配置文件
import router from './router' // 路由
import statics from 'koa-static' // 处理静态资源
import 'reflect-metadata'
import { ConnectionOptions, createConnection} from 'typeorm'

const app = new Koa()

createConnection(<ConnectionOptions>config.sql).catch(error => console.log('数据库连接失败', error))
app.use(cors()) // 解决跨域
// 获取静态资源文件夹
app.use(statics(path.join(__dirname, '/public')))
// 404重定向
// app.use(async (ctx, next) => {
//     await next();
//     if (parseInt(ctx.status) === 404) {
//         ctx.response.redirect("/404")
//     }
// })
app.use(bodyParser()) // 处理body(必须先处理fordata再处理body)
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(config.port, () => {
    console.log('Server is running at http://localhost:' + config.port)
})