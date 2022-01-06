import mysql from 'mysql'
import config from '../config'
const pool = mysql.createPool(config.sql)

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

const query = function (sql:string, values?:string) :Promise<Array<any>>{
    return new Promise((resolve, reject) => {
        pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                console.error(poolErr)
                reject(poolErr)
            } else {
                connection.query(sql, values, (connectionErr, rows) => {
                    if (connectionErr) {
                        console.error(connectionErr)
                        reject(connectionErr)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

export default query