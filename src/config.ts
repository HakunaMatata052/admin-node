import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
dotenv.config({'path': '.env'})

const isDevMode = process.env.NODE_ENV === 'development'

const config = {
    'port': Number(process.env.PORT || 3000),
    'debugLogging': isDevMode,
    'dbsslconn': ! isDevMode,
    'jwtSecret': fs.readFileSync(path.join(__dirname, './ssl/key.pem')),
    'databaseUrl': process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/apidb',
    'dbEntitiesPath': [
        ... isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js']
    ],
    'cronJobExpression': '0 * * * *',
    'miniapp': {
        'appid': 'wx4d9c096a1140d773',
        'secret': '0fb3b2dfe43c2d6025d96966e4e444c4'
    },
    'maxFileSize': 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    'uploadDir': path.join(__dirname, 'public/uploads') // 文件上传目录
}

export {config}