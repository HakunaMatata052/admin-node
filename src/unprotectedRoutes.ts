import Router from '@koa/router'
import formData from 'koa-body'
import {login, attachment} from './controller'
import {config} from './config'
const unprotectedRouter = new Router()

unprotectedRouter.post('/login', login.login)
unprotectedRouter.post('/reg', login.register)
unprotectedRouter.post('/wxLogin', login.wxLogin)
unprotectedRouter.post('/wxLogin', login.wxLogin)
unprotectedRouter.post('/upload', formData({
    'encoding': 'gzip',
    'multipart': true, // 是否支持 multipart-formdate 的表单
    'formidable': {
        'hash': 'md5',
        'maxFileSize': config.maxFileSize,
        'uploadDir': config.uploadDir, // 设置文件上传目录
        'keepExtensions': true // 保持文件的后缀
        // 'onFileBegin': (name, file) => { // 文件上传前的设置
        //     console.log(`name: ${name}`, file)
        // }
    }
}), attachment.upload)

export {unprotectedRouter}