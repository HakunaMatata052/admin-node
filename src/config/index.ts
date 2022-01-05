const config = {
    'port': 5000,
    'sql': {
        'host': '127.0.0.1',
        'user': 'root',
        'password': 'root',
        'database': 'koa2'
    },
    'miniapp': {
        'appid': 'wx4d9c096a1140d773',
        'secret': '0fb3b2dfe43c2d6025d96966e4e444c4'
    },
    'maxFileSize': 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    'uploadDir': 'public/uploads/'
}

export default config