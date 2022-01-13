import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm'
import {IsAlpha, Length} from 'class-validator'
@Entity()
export class System {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        'length': 50
    })
    @IsAlpha('en-US', {
        'message': '名称仅限英文字母'
    })
    @Length(1, 30, {
        'message': '名称1-10个字'
    })
    @Index({'unique': true})
    name: string

    @Column({
        'length': 50
    })
    @Length(1, 10, {
        'message': '标题1-10个字'
    })
    title: string

    @Column({
        'length': 255
    })
    @Length(1, 30, {
        'message': '内容限制255个字符'
    })
    value: string

    @Column({
        'default': false
    })
    constant: boolean

    @Column({
        'default': 0
    })
    sort: number
}