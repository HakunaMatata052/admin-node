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
    @body({
        'page': {'required': false},
        'pageSize': {'required': false}
    })
    @middlewares([permissions])
    public static async getUsers (ctx: Context): Promise<void> {
        const {page, pageSize} = ctx.request.body
        const defaultPage = 5
        const userRepository: Repository<User> = getManager().getRepository(User)
        const users: [User[], number] = await userRepository.findAndCount({
            'skip': (Number(page) - 1) * Number(pageSize || defaultPage) || 0,
            'take': Number(pageSize) || defaultPage
        })

        new Result(ctx).success({
            'list': users[0].map(item=>{
                return {
                    'id': item.id,
                    'username': item.username,
                    'avatar': item.username,
                    'openid': item.openid,
                    'roles': [item.ismanage ? 'admin' : ''],
                    'timestamp': item.timestamp.getTime()
                }
            }),
            'total': users[1]
        })
    }

    @request('get', '/userInfo')
    @summary('获取当前用户信息')
    public static async getUserInfo (ctx: Context):Promise<void>{
        const userRepository: Repository<User> = getManager().getRepository(User)
        const user: User = await userRepository.findOne({'openid': ctx.state.user.openid})

        if (user){
            new Result(ctx).success({
                'id': user.id,
                'username': user.username,
                'avatar': user.avatar,
                'ismanage': user.ismanage,
                'roles': [user.ismanage ? 'admin' : ''],
                'timestamp': user.timestamp.getTime()
            })
        } else {
            new Result(ctx).error('没有这个用户')
        }
    }

    @request('get', '/user/{id}')
    @summary('获取指定用户信息')
    @path({
        'id': {'required': true, 'example': '6'}
    })
    @middlewares([permissions])
    public static async getUser (ctx: Context):Promise<void>{
        const id = ctx.params.id
        const userRepository: Repository<User> = getManager().getRepository(User)
        const user: User = await userRepository.findOne({id})

        if (user){
            new Result(ctx).success({
                'id': user.id,
                'username': user.username,
                'avatar': user.avatar,
                'ismanage': user.ismanage,
                'roles': [user.ismanage ? 'admin' : ''],
                'timestamp': user.timestamp.getTime()})
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
    public static async setUser (ctx: Context):Promise<void>{
        const userRepository: Repository<User> = getManager().getRepository(User)
        const requestBody = pick(ctx.request.body, ['id', 'username', 'avatar', 'password', 'ismanage'])

        if (requestBody.id){
            // update
            requestBody.id = Number(requestBody.id)
            const errors: ValidationError[] = await validate(requestBody)

            console.log(requestBody, errors)
            if (errors.length > 0){
                new Result(ctx).error(errors)
                return
            }
            let user:User = await userRepository.findOne({'id': requestBody.id})

            if (!user){
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
            // create
            if (await userRepository.findOne({'username': requestBody.username})){
                new Result(ctx).error('用户已存在')
                return
            }
            const newUser:User = new User()

            newUser.username = requestBody.username
            newUser.password = requestBody.password
            newUser.avatar = requestBody.avatar
            newUser.ismanage = requestBody.ismanage

            const errors: ValidationError[] = await validate(newUser, {
                'groups': ['admin']
            })

            if (errors.length > 0){
                new Result(ctx).error(errors)
                return
            }

            newUser.password = md5(newUser.password)
            // newUser.timestamp = new Date()
            newUser.openid = md5(newUser.username)

            await userRepository.save(newUser)
            new Result(ctx).success()
        }

    }

    @request('get', '/user/del/{id}')
    @summary('删除用户')
    @middlewares([permissions])
    @path({
        'id': {'required': true, 'example': '6'}
    })
    public static async delUser (ctx: Context):Promise<void>{
        const id = ctx.params.id
        const userRepository: Repository<User> = getManager().getRepository(User)
        const user: User = await userRepository.findOne({id})

        if (user){
            await userRepository.remove(user)
            new Result(ctx).success()
        } else {
            new Result(ctx).error('没有这个用户')
        }
    }

}
