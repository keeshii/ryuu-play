import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Message } from './message';
import { User } from './user';
import { bigint } from '../transformers/bigint';

@Entity()
@Unique(['owner', 'user'])
export class Conversation extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @ManyToOne(type => User, user => user.conversations)
  owner: User = new User();

  @ManyToOne(type => User)
  user: User = new User();

  @OneToMany(type => Message, message => message.conversation)
  messages!: Message[];

  @Column({ type: 'bigint', transformer: [ bigint ] })
  public modified: number = Date.now();

  @Column()
  public isRead: boolean = false;

  @Column()
  public lastMessageText: string = '';

}
