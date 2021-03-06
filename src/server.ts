import Koa from 'koa'
import jwt from 'koa-jwt'
import http from 'http'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import winston from 'winston'
import statics from 'koa-static'
import {createConnection} from 'typeorm'
import 'reflect-metadata'

import {logger} from './logger'
import {Config} from './config'
import {unprotectedRouter} from './unprotectedRoutes'
import {protectedRouter} from './protectedRoutes'
import {cron} from './cron'
import {checkToken, customError} from './common/auth'
import {error} from './common/error'

import {Socket} from './controller/socket'

// if (connectionOptions.ssl) {
//     connectionOptions.extra.ssl = {
//         'rejectUnauthorized': false // Heroku uses self signed certificates
//     }
// }
// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection(Config.sql).then(async () => {
    const app = new Koa()
    // Provides important security headers to make your app more secure

    await Config.updateConfig()
    app.use(helmet.contentSecurityPolicy({
        'directives': {
            'defaultSrc': ['\'self\''],
            'scriptSrc': ['\'self\'', '\'unsafe-inline\'', 'cdnjs.cloudflare.com'],
            'styleSrc': ['\'self\'', '\'unsafe-inline\'', 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
            'fontSrc': ['\'self\'', 'fonts.gstatic.com'],
            'imgSrc': ['\'self\'', 'data:', 'online.swagger.io', 'validator.swagger.io']
        }
    }))

    const server = http.createServer(app.callback())

    new Socket(server) // 启动Socket
    // 跨域解决
    app.use(cors())
    // 获取静态资源文件夹
    app.use(statics(Config.staticDir))
    // 错误日志打印
    app.use(logger(winston))
    app.use(bodyParser())
    // 全局错误自定义
    app.use(error)
    // 401错误自定义
    app.use(customError)
    // 无须鉴权的路由
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())
    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(jwt({'secret': Config.jwtSecret}).unless({'path': [/^\/swagger-/]}))
    // 鉴权
    app.use(checkToken)
    // 需要鉴权的路由
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

    // 定时任务开启
    cron.start()

    server.listen(Config.port, () => {
        console.log(`启动成功 端口：${Config.port}`)
    })

}).catch((err: string) => console.log('TypeORM connection error: ', err))