import {ValidationError} from 'class-validator'
import {ParameterizedContext} from 'koa'
class Result {
    ctx:ParameterizedContext
    msg:string
    code:number
    data:unknown
    constructor(ctx:ParameterizedContext){
        this.ctx = ctx
    }
    success(data?:unknown, msg?:string):void{
        this.ctx.body = {
            'code': 200,
            'msg': msg || 'success',
            'data': data || {}
        }
    }
    error(msg?:string|ValidationError[], code?:number):void{
        let message = msg

        if (msg instanceof ValidationError === true){
            message = (msg as ValidationError[]).map(item=>Object.values(item.constraints)).join(',')
        }
        this.ctx.body = {
            'code': code || 0,
            'msg': message || '请求失败'
        }
    }
}
export default Result