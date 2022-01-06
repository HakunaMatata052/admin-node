import 'reflect-metadata'
import path from 'path'
import { createConnection} from 'typeorm'

const query = async ()=>{
    console.log(path.join(__dirname, '../entity/*.ts' ))
    return createConnection({
        'type': 'mysql',
        'host': 'localhost',
        'port': 3306,
        'username': 'root',
        'password': 'root',
        'database': 'koa2',
        'entities': [
            path.join(__dirname, '../entity/*.ts' )
        ],
        'synchronize': true
    }).catch(error => console.log(error))
}

export default query

