import { ParameterizedContext } from 'koa'
class Result {
    ctx:ParameterizedContext
    msg:string
    code:number
    data:any
    constructor(ctx:ParameterizedContext){
        this.ctx =ctx
    }
    success(data:any, msg?:string){
        this.ctx.body = {
            'code': 200,
            'msg': msg || '请求成功',
            'data': data
        }
    }
    error(msg?:string, code?:number){
        this.ctx.body = {
            'code': code || 0,
            'msg': msg||'请求失败',
            'data': {}
        }
    }
}
export default Result