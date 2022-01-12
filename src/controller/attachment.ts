import {Context} from 'koa'
import {request, summary, tagsAll, formData, body, path, middlewares} from 'koa-swagger-decorator'
import {Attachment} from '../entity/attachment'
import {getManager, Repository} from 'typeorm'
import Result from '../common/result'
import fs from 'fs'
import Path from 'path'
import {permissions} from '../common/permissions'
@tagsAll(['attachment'])
export default class AttachmentController {

    @request('post', '/upload')
    @summary('上传')
    @formData({
        'file': {'type': 'file', 'required': true}
    })
    public static async upload(ctx: Context): Promise<void> {
        const files = <any>ctx.request.files

        const basename = Path.basename(files.file.path)
        const attachmentRepository:Repository<Attachment> = getManager().getRepository(Attachment)
        const newAttachment = new Attachment()

        newAttachment.originalname = files.file.name
        newAttachment.imgurl = `/uploads/${basename}`
        // newAttachment.timestamp = new Date()
        newAttachment.size = files.file.size
        try {
            await attachmentRepository.save(newAttachment)
            new Result(ctx).success({
                'imgUrl': `${ctx.origin}/uploads/${basename}`
            }, '上传成功')
        } catch (err){
            fs.unlinkSync(Path.join(__dirname, `../public/uploads/${basename}`))
            throw new Error(err.message || '上传失败')
        }
    }

    @request('get', '/attachment/list')
    @summary('附件列表')
    @body({
        'page': {'required': false},
        'pageSize': {'required': false}
    })
    @middlewares([permissions])
    public static async getAttachmentList(ctx: Context): Promise<void> {
        const {page, pageSize} = ctx.request.body
        const defaultPage = 5 // 默认分页大小
        const attachmentRepository:Repository<Attachment> = getManager().getRepository(Attachment)
        const attachmentList:[Attachment[], number] = await attachmentRepository.findAndCount({
            'skip': (Number(page) - 1) * Number(pageSize || defaultPage) || 0,
            'take': Number(pageSize) || defaultPage
        })

        new Result(ctx).success({
            'list': attachmentList[0]?.map((item:Attachment)=>{
                return {
                    ...item,
                    'imgurl': `${ctx.origin}${item.imgurl}`,
                    'timestamp': item.timestamp.getTime()
                }
            }),
            'totel': attachmentList[1]
        })
    }

    @request('get', '/attachment/remove/{id}')
    @summary('删除附件')
    @path({
        'id': {'type': 'number', 'required': true}
    })
    @middlewares([permissions])
    public static async delAttachment(ctx: Context): Promise<void> {
        const id = Number(ctx.params.id)

        console.log(id)
        const attachmentRepository:Repository<Attachment> = getManager().getRepository(Attachment)
        const attachment = await attachmentRepository.findOne({id})

        if (attachment){
            await attachmentRepository.remove(attachment)
            fs.unlinkSync(Path.join(__dirname, `../public${attachment.imgurl}`))
            new Result(ctx).success({}, '删除成功')
        } else {
            new Result(ctx).error('附件不存在')
        }

    }
}