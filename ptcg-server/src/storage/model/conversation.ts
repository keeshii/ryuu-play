import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { Message } from './message';
import { User } from './user';

@Entity()
@Unique(['user1', 'user2'])
export class Conversation extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @ManyToOne(type => User)
  user1: User = new User();

  @ManyToOne(type => User)
  user2: User = new User();

  @OneToMany(type => Message, message => message.conversation)
  messages!: Message[];

  @OneToOne(type => Message)
  @JoinColumn()
  lastMessage!: Message;

}
