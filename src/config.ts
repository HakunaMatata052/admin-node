import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import {ConnectionOptions, getManager, Repository} from 'typeorm'
import {System} from './entity/system'
dotenv.config({'path': '.env'})

const isDevMode = process.env.NODE_ENV === 'development'

export interface MiniApp {
    appid:string |undefined
    secret:string|undefined
}
// export interface Config {
//     port:number
//     sql:ConnectionOptions
//     debugLogging:boolean
//     jwtSecret:Buffer
//     cronJobExpression:string
//     miniapp:MiniApp
//     maxFileSize:number
//     uploadDir:string
// }

export const sql :ConnectionOptions = isDevMode ? {
    'type': 'mysql',
    'host': 'localhost',
    'port': 3306,
    'username': 'root',
    'password': 'root',
    'database': 'server',
    'entities': [path.join(__dirname, 'entity/**/*')],
    'synchronize': true
} : {
    'type': 'mysql',
    'host': 'localhost',
    'port': 3306,
    'username': 'wenjuan',
    'password': 'pwTLEac2chBSDBYe',
    'database': 'wenjuan',
    'entities': [path.join(__dirname, 'entity/**/*')],
    'synchronize': true
}
export class Config {
    static port =Number(process.env.PORT || 3000)
    static sql=sql
    static debugLogging= isDevMode
    static staticDir = path.join(__dirname, '/public')
    static jwtSecret= fs.readFileSync(path.join(__dirname, './ssl/privatekey.pem'))
    static cronJobExpression= '0 * * * *'
    static miniapp:MiniApp= {
        'appid': '',
        'secret': ''
    }
    static maxFileSize= 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    static uploadDir= path.join(__dirname, 'public/uploads') // 文件上传目录
    // 从数据库更新config配置
    static async updateConfig():Promise<void>{
        const systemRepository:Repository<System> = getManager().getRepository(System)
        const system:System[] = await systemRepository.find()

        Config.miniapp.appid = system.filter(item=>item.name === 'miniappid')[0]?.value
        Config.miniapp.secret = system.filter(item=>item.name === 'minisecret')[0]?.value

    }
}

// export const config:Config = {
//     'port': Number(process.env.PORT || 3000),
//     'sql': sql,
//     'debugLogging': isDevMode,
//     'jwtSecret': fs.readFileSync(path.join(__dirname, './ssl/key.pem')),
//     'cronJobExpression': '0 * * * *',
//     'miniapp': {
//         'appid': 'wx4d9c096a1140d773',
//         'secret': '0fb3b2dfe43c2d6025d96966e4e444c4'
//     },
//     'maxFileSize': 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
//     'uploadDir': path.join(__dirname, 'public/uploads') // 文件上传目录
// }

