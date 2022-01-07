
import path from 'path'
import Router from 'koa-router'
import formData from 'koa-body' // 处理formdata
import Result from '../../common/result'
import config from '../../config'
import fs from 'fs'
import { getConnection } from 'typeorm'
import { Attachment } from '../../entity/attachment'

const router = new Router()

// 保存上传文件
router.post('/', formData({
    'encoding': 'gzip',
    'multipart': true, // 是否支持 multipart-formdate 的表单
    'formidable': {
        'hash': 'md5',
        'maxFileSize': config.maxFileSize,
        'uploadDir': path.join(__dirname, '../../public/uploads/'), // 设置文件上传目录
        'keepExtensions': true // 保持文件的后缀
        // 'onFileBegin': (name, file) => { // 文件上传前的设置
        //     console.log(`name: ${name}`, file)
        // }
    }
}), async ctx => {
    const files = <any>ctx.request.files
    const basename = path.basename(files.file.path)

    const res = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Attachment)
        .values({
            'originalname': basename,
            'imgurl': `/uploads/${basename}`,
            'timestamp': new Date()
        })
        .execute()

    console.log(res)
    if (res){
        new Result(ctx).success({
            'imgUrl': `${ctx.origin}/uploads/${basename}`
        }, '上传成功')
    } else {
        fs.unlinkSync(path.join(__dirname, `../../public/uploads/${basename}`))
        new Result(ctx).error('上传失败')
    }
})
export default router