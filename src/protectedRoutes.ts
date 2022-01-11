import {SwaggerRouter} from 'koa-swagger-decorator'
// import { user } from './controller'

const protectedRouter = new SwaggerRouter()

// USER ROUTES
// protectedRouter.get('/users', user.getUsers)

// Swagger endpoint
protectedRouter.swagger({
    'title': 'api调试',
    'description': '666',
    'version': '1.8.0'
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname)

export {protectedRouter}