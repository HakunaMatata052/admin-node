import Router from 'koa-router'
import md5 from 'md5'
import {cloneDeep, omit} from 'lodash'
import dateFormat from 'date-format'
import { auth, adminAuth } from '../../common/auth'
import Result from '../../common/result'
import { getConnection } from 'typeorm'
import { User } from '../../entity/User'
const router = new Router()

router.get('/', auth, adminAuth, async ctx => {
    console.log( ctx.request.query.id)
    const userInfo = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.id = :id', {'id': ctx.request.query.id})
        .getOne()

    if (userInfo) {
        new Result(ctx).success({
            'id': userInfo.id,
            'avatar': userInfo.avatar,
            'username': userInfo.username,
            'ismanage': userInfo.ismanage,
            'openid': userInfo.openid,
            'timestamp': dateFormat('yyyy-MM-dd hh:mm:ss', userInfo.timestamp)
        })
    } else {
        new Result(ctx).error('用户不存在')
    }
})

router.post('/', auth, adminAuth, async ctx => {
    const user = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.openid = :openid', {'openid': ctx.header.openid})
        .getOne()

    if (user && user.ismanage) {
        if (ctx.request.body.password.length > 0) {
            if (ctx.request.body.password.length > 16) {
                new Result(ctx).error('请填写正确的密码')
                return
            }
        }
        if (!ctx.request.body.id) {
            new Result(ctx).error('请填写用户id')
            return
        }

        let newUserInfo = cloneDeep(ctx.request.body)

        if (newUserInfo.password){
            newUserInfo.password = md5(newUserInfo.password)
        }
        newUserInfo = omit(newUserInfo, ['openid', 'timestamp'])
        const res = await getConnection()
            .createQueryBuilder()
            .update(User)
            .set(newUserInfo)
            .where('id = :id', { 'id': ctx.request.body.id })
            .execute()

        if (res.affected===1) {
            new Result(ctx).success({}, '修改成功')
        } else {
            new Result(ctx).error('修改失败')
        }
    } else {
        new Result(ctx).error('你没有权限')
    }
})

router.get('/list', auth, adminAuth, async ctx => {
    const userList = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .getMany()
    // query('select * from user')

    const res = userList.map(item=>{
        return {
            ...item,
            'roles': [item.ismanage ? 'admin' : ''],
            'timestamp': dateFormat('yyyy-MM-dd hh:mm:ss', item.timestamp)
        }
    })

    new Result(ctx).success({'list': res})
})

export default router