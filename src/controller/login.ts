import {Context} from 'koa'
import {body, request, summary, tagsAll} from 'koa-swagger-decorator'
import {User} from '../entity/user'
import {getManager, Repository} from 'typeorm'
import {generateToken} from '../common/auth'
import md5 from 'md5'
import axios from 'axios'
import Result from '../common/result'
import {Config} from '../config'
@tagsAll(['login'])
export default class loginController {

    @request('post', '/login')
    @summary('登录')
    @body({
        'username': {'type': 'string', 'required': true, 'example': 'admin'},
        'password': {'type': 'string', 'required': true, 'example': '123456'}
    })
    public static async login(ctx: Context): Promise<void> {
        const {username, password} = ctx.request.body
        const userRepository:Repository<User> = getManager().getRepository(User)
        const user:User = await userRepository.findOne({username, 'password': md5(password)})

        if (user){
            const token = generateToken(user.openid)

            new Result(ctx).success({token})
        } else {
            new Result(ctx).error('用户名或密码错误')
        }
    }

    @request('post', '/reg')
    @summary('注册')
    @body({
        'username': {'type': 'string', 'required': true, 'example': 'admin'},
        'password': {'type': 'string', 'required': true, 'example': '123456'}
    })
    public static async register(ctx: Context): Promise<void> {
        const {username, password} = ctx.request.body

        const userRepository:Repository<User> = getManager().getRepository(User)

        if (await userRepository.findOne({'username': username})){
            new Result(ctx).error('用户已存在')
            return
        }
        const newUser:User = new User()

        newUser.username = username
        newUser.password = md5(password)
        newUser.openid = md5(username)
        // newUser.timestamp = new Date()
        await userRepository.save(newUser)
        const token = generateToken(newUser.openid)

        new Result(ctx).success({token})
    }

    @request('post', '/wxlogin')
    @summary('微信登录')
    @body({
        'code': {'type': 'string', 'required': true}
    })
    public static async wxLogin(ctx: Context): Promise<void> {
        const {code} = ctx.request.body
        const {appid, secret} = Config.miniapp

        if (!appid || !secret){
            new Result(ctx).error('请先在后台配置appid和secret')
            return
        }
        if (!code) {
            new Result(ctx).error('code无效')
            return
        }
        try {
            const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)

            if (res && res.data && res.data.errcode === 0){

                console.log(res.data)
                const userRepository:Repository<User> = getManager().getRepository(User)
                const user = userRepository.findOne({'openid': res.data.openid})
                const openid = res.data.openid

                if (! user){
                    const newUser:User = new User()

                    newUser.openid = res.data.openid
                    // newUser.timestamp = new Date()
                    await userRepository.save(newUser)

                }
                const token = generateToken(openid)

                new Result(ctx).success({token})

            } else {
                throw new Error(res.data.errmsg)
            }
        } catch (err){
            throw new Error(err.message || '获取openid失败')
        }
    }
}