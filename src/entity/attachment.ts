import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn()
        id: number

    @Column({
        'length': 50
    })
        originalname: string

    @Column({
        'length': 100
    })
        imgurl: string

    @Column({
        'nullable': true
    })
        timestamp: Date
}