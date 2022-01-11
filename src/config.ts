import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import {ConnectionOptions} from 'typeorm'
dotenv.config({'path': '.env'})

const isDevMode = process.env.NODE_ENV === 'development'

interface MiniApp {
    appid:string
    secret:string
}
interface Config {
    port:number
    sql:ConnectionOptions
    debugLogging:boolean
    jwtSecret:Buffer
    cronJobExpression:string
    miniapp:MiniApp
    maxFileSize:number
    uploadDir:string
}
const config:Config = {
    'port': Number(process.env.PORT || 3000),
    'sql': {
        'type': 'mysql',
        'host': 'localhost',
        'port': 3306,
        'username': 'root',
        'password': 'root',
        'database': 'server',
        'entities': [path.join(__dirname, 'entity/**/*')],
        'synchronize': true
    },
    'debugLogging': isDevMode,
    'jwtSecret': fs.readFileSync(path.join(__dirname, './ssl/key.pem')),
    'cronJobExpression': '0 * * * *',
    'miniapp': {
        'appid': 'wx4d9c096a1140d773',
        'secret': '0fb3b2dfe43c2d6025d96966e4e444c4'
    },
    'maxFileSize': 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    'uploadDir': path.join(__dirname, 'public/uploads') // 文件上传目录
}

export {config}