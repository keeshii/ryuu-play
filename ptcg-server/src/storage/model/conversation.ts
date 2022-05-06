import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { Message } from './message';
import { User } from './user';

@Entity()
@Unique(['user1', 'user2'])
export class Conversation extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => User)
    user1: User = new User();

  @ManyToOne(type => User)
    user2: User = new User();

  @OneToMany(type => Message, message => message.conversation)
    messages!: Message[];

  @OneToOne(type => Message, { onDelete: 'CASCADE' })
  @JoinColumn()
    lastMessage!: Message;

  public static async findByUsers(user1: User, user2: User): Promise<Conversation> {
    const conversations = await Conversation.find({
      relations: ['user1', 'user2'],
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id }},
        { user1: { id: user2.id }, user2: { id: user1.id }}
      ]
    });

    if (conversations.length === 0) {
      const conversation = new Conversation();
      conversation.user1 = user1;
      conversation.user2 = user2;
      return conversation;
    }

    return conversations[0];
  }

}
