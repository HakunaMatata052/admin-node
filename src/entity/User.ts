import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
        id: number

    @Column({
        'length': 50
    })
        username: string

    @Column({
        'length': 50
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