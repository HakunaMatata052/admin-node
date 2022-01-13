import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm'
import {IsNotEmpty, Length} from 'class-validator'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        'length': 50,
        'nullable': true
    })
    @Length(4, 10, {
        'message': '用户名在4-10个字符之间',
        'groups': ['admin']
    })
    @IsNotEmpty({
        'message': '用户名不能为空',
        'groups': ['admin']
    })
    @Index({'unique': true})
    username: string

    @Column({
        'length': 50,
        'nullable': true
    })
    @IsNotEmpty({
        'message': '密码不能为空',
        'groups': ['admin']
    })
    @Length(6, 18, {
        'message': '密码在6-18个字符之间',
        'groups': ['admin']
    })
    password: string

    @Column({
        'length': 150
    })
    @IsNotEmpty({
        'message': 'openid不能为空',
        'groups': ['wx']
    })
    @Index({'unique': true})
    openid: string

    @Column({
        'default': false
    })
    ismanage: boolean

    @Column({
        'length': 250,
        'nullable': true
    })
    avatar: string

    @Column({
        'default': ()=>'NOW()'
    })
    timestamp: Date
}

export const userSchema = {
    'id': {'type': 'number', 'required': true, 'example': 1},
    'name': {'type': 'string', 'required': true, 'example': 'Javier'},
    'email': {'type': 'string', 'required': true, 'example': 'avileslopez.javier@gmail.com'}
}