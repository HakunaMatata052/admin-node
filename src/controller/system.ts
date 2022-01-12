import {validate, ValidationError} from 'class-validator'
import {Context} from 'koa'
import {body, middlewares, path, request, summary, tagsAll} from 'koa-swagger-decorator'
import {Config} from '../config'
import {getManager, Repository} from 'typeorm'
import Result from '../common/result'
import {System} from '../entity/system'
import {permissions} from '../common/permissions'
@tagsAll(['system'])
export default class systemController {

    @request('get', '/basic')
    @summary('基本配置获取')
    @middlewares([permissions])
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
    @middlewares([permissions])
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
        await Config.updateConfig()
        await systemRepository.save(newSyetem)
        new Result(ctx).success({}, (newSyetem.id === 0 ? '修改' : '添加') + '成功')
    }

    @request('get', '/basic/del/{id}')
    @summary('删除基本配置')
    @path({
        'id': {'type': 'string', 'required': true}
    })
    @middlewares([permissions])
    public static async delBasic(ctx: Context): Promise<void> {
        const id = ctx.params.id
        const systemRepository:Repository<System> = getManager().getRepository(System)
        const system:System = await systemRepository.findOne({id})

        if (!system) {
            new Result(ctx).error('配置项不存在')
            return
        }
        if (system.constant) {
            new Result(ctx).error('常量配置不可删除')
            return
        }
        await systemRepository.remove(system)
        new Result(ctx).success()
    }

}