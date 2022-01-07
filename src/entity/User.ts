import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
        id: number

    @Column({
        'length': 50,
        'nullable': true
    })
        username: string

    @Column({
        'length': 50,
        'nullable': true
    })
        password: string

    @Column({
        'length': 250
    })
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
        'nullable': true
    })
        timestamp: Date
}