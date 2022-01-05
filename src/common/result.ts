import { ParameterizedContext } from 'koa'
class Result {
    ctx:ParameterizedContext
    msg:string
    code:number
    data:any
    constructor(ctx, msg='success', code=200, data:any=[]){
        this.ctx =ctx
        this.code = code
        this.msg = msg || 'success'
        this.data = data
        this.result()
    }
    result(){
        this.ctx.body = {
            'code':this.code,
            'msg':this.msg,
            'data':this.data
        }
    }
}
export default Result