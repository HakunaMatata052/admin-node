interface config {
    port:number
    sql:{
        host:string
        user:string
        password:string
        database:string
    },
    miniapp:{
        appid:string
        secret:string
        [propName:string]:any
    }
}
const config:config = {
    'port': 5000,
    'sql': {
        'host': '127.0.0.1',
        'user': 'root',
        'password': 'root',
        'database': 'koa2'
    },
    'miniapp':{
        'appid':'wx4d9c096a1140d773',
        'secret':'0fb3b2dfe43c2d6025d96966e4e444c4'
    }
}

export default config