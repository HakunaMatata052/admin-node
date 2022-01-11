import {validate, ValidationError} from 'class-validator'
import {Context} from 'koa'
import {body, request, summary, tagsAll} from 'koa-swagger-decorator'
import {getManager, Repository} from 'typeorm'
import Result from '../common/result'
import {System} from '../entity/system'
@tagsAll(['system'])
export default class systemController {

    @request('get', '/basic')
    @summary('基本配置获取')
    public static async getBasic(ctx: Context): Promise<void> {
        const systemRepository:Repository<System> = getManager().getRepository(System)
        const system:System[] = await systemRepository.find()

        new Result(ctx).success(system)
    }

    @request('post', '/basic/add')
    @summary('添加基本配置')
    @body({
        'id': {'type': 'number', 'required': false},
        'name': {'type': 'string', 'required': true},
        'title': {'type': 'string', 'required': true},
        'value': {'type': 'string', 'required': true},
        'sort': {'type': 'number', 'required': false}
    })
    public static async addBasic(ctx: Context): Promise<void> {
        const {id, name, title, value, sort} = ctx.request.body
        const systemRepository:Repository<System> = getManager().getRepository(System)
        const newSyetem = new System()

        newSyetem.id = +Number(id) || 0
        newSyetem.name = name
        newSyetem.title = title
        newSyetem.value = value
        newSyetem.sort = Number(sort) || 0

        const errors: ValidationError[] = await validate(newSyetem)

        if (errors.length > 0){
            new Result(ctx).error(errors)
            return
        }
        if (!await systemRepository.findOne({id})){
            new Result(ctx).error('用户不存在')
            return
        }
        await systemRepository.save(newSyetem)
        new Result(ctx).success({}, (newSyetem.id === 0 ? '修改' : '添加') + '成功')
    }

}