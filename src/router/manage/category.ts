import Router from 'koa-router'
import { auth, adminAuth} from '../../common/auth'
import Result from '../../common/result'
import {User} from '../../entity/User'
import { getConnection} from 'typeorm'
const router = new Router()

router.get('/add', auth, adminAuth, async ctx => {
    const user = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .getOne()

    console.log(user)

    // console.log(res)
    // if (ctx.request.body.id){
    //     // 修改

    //     if (ctx.request.body.name){
    //         await query(`update category set name = '${ctx.request.body.name}' where id = '${ctx.request.body.id}'`)
    //     }
    //     if (category) {
    //         new Result(ctx).success({}, '修改成功')
    //     }
    // } else {
    //     // 新建

    //     const category = await query(`insert into category where id = '${ctx.header.body.id}'`)

    //     new Result(ctx)
    // }
    // const userInfo = await query(`select * from user where openid = '${ctx.header.openid}'`)
    new Result(ctx).success(user)

})

export default router