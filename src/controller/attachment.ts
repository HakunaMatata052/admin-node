import {Context} from 'koa'
import {request, summary, tagsAll, formData, body} from 'koa-swagger-decorator'
import {Attachment} from '../entity/attachment'
import {getManager, Repository} from 'typeorm'
import Result from '../common/result'
import fs from 'fs'
import path from 'path'
@tagsAll(['attachment'])
export default class attachment {

    @request('post', '/upload')
    @summary('上传')
    @formData({
        'file': {'type': 'file', 'required': true}
    })
    public static async upload(ctx: Context): Promise<void> {
        const files = <any>ctx.request.files
        const basename = path.basename(files.file.path)
        const userRepository:Repository<Attachment> = getManager().getRepository(Attachment)
        const newAttachment = new Attachment()

        newAttachment.originalname = basename
        newAttachment.imgurl = `/uploads/${basename}`
        newAttachment.timestamp = new Date()
        try {
            await userRepository.save(newAttachment)
            new Result(ctx).success({
                'imgUrl': `${ctx.origin}/uploads/${basename}`
            }, '上传成功')
        } catch (err){
            fs.unlinkSync(path.join(__dirname, `../../public/uploads/${basename}`))
            throw new Error('上传失败')
        }
    }

    @request('get', '/attachment/list')
    @summary('附件列表')
    @body({
        'page': {'required': false},
        'pageSize': {'required': false}
    })
    public static async getAttachmentList(ctx: Context): Promise<void> {
        const {page, pageSize} = ctx.request.body
        const defaultPage = 5 // 默认分页大小
        const userRepository:Repository<Attachment> = getManager().getRepository(Attachment)
        const attachmentList = await userRepository.findAndCount({
            'skip': (Number(page) - 1) * Number(pageSize || defaultPage) || 0,
            'take': Number(pageSize) || defaultPage
        })

        new Result(ctx).success({
            'list': attachmentList[0],
            'totel': attachmentList[1]
        })
    }

}