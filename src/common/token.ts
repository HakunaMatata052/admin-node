import fs from 'fs' // 文件模块
import path from 'path' // 路径模块
import jwt from 'jsonwebtoken' // 引入jsonwebtoken模块

class Jwt {
    data:string
    // 获取调用方法的传值
    constructor(data) {
        this.data = data
    }
    // 生成token
    generateToken() {
        let data = this.data
        // 获取时间转成时间戳
        let created = new Date().getTime()
        // 私钥，引入生成的私钥
        let cert = fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))
        let token = jwt.sign({
            'token': data,
            'validityTime': created + 3000000// 自定义token 的有效时间
        }, cert, { 'algorithm': 'RS256' })

        return token
    }
    // 校验token
    verifyToken() {
        // 公钥
        const cert = fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))

        try {
            // 解密生成的token
            const Result = jwt.verify(this.data, cert, { 'algorithms': ['RS256'] }) || {}
            // 获取生成token的时间
            const { validityTime } = <jwt.JwtPayload>Result
            // 获取当前时间
            const current = new Date().getTime()
            // 判断是否失效

            if (current <= validityTime) {
                return Result
            }
            throw new Error()

        } catch (err) {
            throw new Error()
        }
    }
}
export default Jwt