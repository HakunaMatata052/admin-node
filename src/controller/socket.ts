import http from 'http'
import {Server} from 'socket.io'
export class Socket {
    constructor(server:http.Server) {
        const io = new Server(server)

        io.on('connection', (socket:any) => {
            console.log('初始化成功！下面可以用socket绑定事件和触发事件了', socket)
            socket.on('send', (data:any) => {
                console.log('客户端发送的内容：', data)
                socket.emit('getMsg', '我是返回的消息... ...')
            })
            // setInterval( () => {
            //     socket.emit('getMsg', '我是初始化3s后的返回消息... ...')
            // }, 3000)
        })
    }
}