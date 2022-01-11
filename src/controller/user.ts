import {Context} from 'koa'
import {getManager, Repository} from 'typeorm'
import {validate, ValidationError} from 'class-validator'
import {request, summary, path, body, tagsAll, middlewares} from 'koa-swagger-decorator'
import {User} from '../entity/user'
import Result from '../common/result'
import {pick, identity, pickBy} from 'lodash'
import md5 from 'md5'
import {permissions} from '../common/permissions'

// @responsesAll({'200': {'description': 'success'}, '400': {'description': 'bad request'}, '401': {'description': 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['User'])
export default class UserController {

    @request('get', '/user/list')
    @summary('用户列表')
    @middlewares([permissions])
    public static async getUsers (ctx: Context): Promise<void> {
        const userRepository: Repository<User> = getManager().getRepository(User)
        const users: User[] = await userRepository.find()

        new Result(ctx).success(users.map(item=>{
            return {
                'id': item.id,
                'username': item.username,
                'avatar': item.username,
                'openit': item.openid,
                'roles': [item.ismanage ? 'admin' : ''],
                'timestamp': item.timestamp.getTime()
            }
        }))
    }
    @request('get', '/user/{id}')
    @summary('获取用户信息')
    @path({
        'id': {'required': true, 'example': '6'}
    })
    @middlewares([permissions])
    async getUser (ctx: Context):Promise<void>{
        const userRepository: Repository<User> = getManager().getRepository(User)
        const user: User = await userRepository.findOne({
            'id': Number(ctx.params.id)
        })

        if (user){
            new Result(ctx).success(user)
        } else {
            new Result(ctx).error('没有这个用户')
        }
    }

    @request('post', '/user/')
    @summary('修改/新增用户信息')
    @body({
        'id': {'required': false},
        'username': {'required': false},
        'avatar': {'required': false},
        'password': {'required': false},
        'ismanage': {'required': false}
    })
    @middlewares([permissions])
    async setUser (ctx: Context):Promise<void>{
        const userRepository: Repository<User> = getManager().getRepository(User)
        const requestBody = pick(ctx.request.body, ['id', 'username', 'avatar', 'password', 'ismanage'])

        if (requestBody.id){
            requestBody.id = Number(requestBody.id)
            const errors: ValidationError[] = await validate(requestBody)

            console.log(requestBody, errors)
            if (errors.length > 0){
                new Result(ctx).error(errors)
                return
            }
            // update
            let user:User = await userRepository.findOne({'id': requestBody.id})

            if (user){
                user = {...user, ...pickBy(requestBody, identity)}
                if (user.password) {
                    user.password = md5(user.password)
                }
                console.log(user)
                await userRepository.save(user)
                new Result(ctx).success()
            } else {
                new Result(ctx).error('用户不存在')
            }
        } else {
            if (await userRepository.findOne({'username': requestBody.username})){
                new Result(ctx).error('用户已存在')
                return
            }
            const newUser:User = new User()

            newUser.username = requestBody.username
            newUser.password = requestBody.password
            newUser.avatar = requestBody.avatar

            const errors: ValidationError[] = await validate(newUser, {
                'groups': ['admin']
            })

            if (errors.length > 0){
                new Result(ctx).error(errors)
                return
            }

            newUser.password = md5(newUser.password)
            newUser.timestamp = new Date()
            newUser.openid = md5(newUser.username)

            await userRepository.save(newUser)
            new Result(ctx).success()
        }

    }
}
