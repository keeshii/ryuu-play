import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Conversation } from './conversation';
import { User } from './user';
import { bigint } from '../transformers/bigint';

@Entity()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @ManyToOne(type => Conversation, conversation => conversation.messages)
  conversation: Conversation = new Conversation();

  @ManyToOne(type => User)
  sender: User = new User();

  @Column({ type: 'bigint', transformer: [ bigint ] })
  public created: number = Date.now();

  @Column()
  public isRead: boolean = false;

  @Column()
  public isDeletedByUser1: boolean = false;

  @Column()
  public isDeletedByUser2: boolean = false;

  @Column()
  public text: string = '';

}
