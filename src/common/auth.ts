import jwt from 'jsonwebtoken' // 引入jsonwebtoken模块
import {Context, Next} from 'koa'
import {User} from '../entity/user'
import {getManager, Repository} from 'typeorm'
import {config} from '../config'
import Result from './result'

export const generateToken = (data:string):string=>{
    const token = jwt.sign({'openid': data}, config.jwtSecret, {'expiresIn': '7d'})

    return token
}
export const checkToken = async (ctx:Context, next:Next):Promise<void>=>{
    const userRepository: Repository<User> = getManager().getRepository(User)
    // load all users
    const user: User = await userRepository.findOne({'openid': ctx.state.user.openid})

    if (user){
        ctx.state.user = user
        await next()
    } else {
        new Result(ctx).error('token不正确', 401)
    }
}
export const customError = async (ctx:Context, next:Next):Promise<void>=>{
    try {
        return await next()
    } catch (err) {
        if (err.status === 401) {
            new Result(ctx).error('无效token', 401)
        } else if (err.status === 400){
            new Result(ctx).error(err.message)
        } else {
            throw err
        }
    }
}