import Router from 'koa-router'
import Result from '../../common/result'
import path from 'path'

const router = new Router()

router.post('/', async ctx => {
    const files = <any>ctx.request.files
    const basename = path.basename(files.file.path)

    new Result(ctx).success({
        'imgUrl': `${ctx.origin}/uploads/${basename}`
    })
})
export default router