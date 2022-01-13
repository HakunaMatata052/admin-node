import {validate, ValidationError} from 'class-validator'
import {Context} from 'koa'
import {body, middlewares, path, request, summary, tagsAll} from 'koa-swagger-decorator'
import {Config} from '../config'
import {getManager, Repository} from 'typeorm'
import Result from '../common/result'
import {System} from '../entity/system'
import {permissions} from '../common/permissions'
import {pick} from 'lodash'
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
        'name': {'type': 'string', 'required': true},
        'title': {'type': 'string', 'required': true},
        'value': {'type': 'string', 'required': true},
        'sort': {'type': 'number', 'required': false}
    })
    @middlewares([permissions])
    public static async addBasic(ctx: Context): Promise<void> {
        const {name, title, value, sort} = ctx.request.body
        const systemRepository:Repository<System> = getManager().getRepository(System)
        const system:System = new System()

        system.name = name
        system.title = title
        system.value = value
        system.sort = sort
        const errors: ValidationError[] = await validate(system)

        console.log(errors)
        if (errors.length > 0){
            new Result(ctx).error(errors)
            return
        }
        await Config.updateConfig()
        await systemRepository.save(system)
        new Result(ctx).success()
    }
    @request('post', '/basic/edit')
    @summary('修改基本配置')
    @body([{
        'id': {'type': 'number', 'required': false},
        'value': {'type': 'string', 'required': true},
        'sort': {'type': 'number', 'required': false}
    }])

    @middlewares([permissions])
    public static async aeditBasic(ctx: Context): Promise<void> {
        console.log(ctx.request.body)
        const basicArray = Object.values(ctx.request.body).map((item: System)=>pick(item, ['id', 'value', 'sort']))
        const systemRepository:Repository<System> = getManager().getRepository(System)

        const errors: ValidationError[] = await validate(basicArray)

        if (errors.length > 0){
            new Result(ctx).error(errors)
            return
        }
        await Config.updateConfig()
        await systemRepository.save(basicArray)
        new Result(ctx).success()
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