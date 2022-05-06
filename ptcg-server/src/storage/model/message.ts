import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne,
  Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Conversation } from './conversation';
import { User } from './user';
import { bigint } from '../transformers/bigint';

@Entity()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
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

  @Transaction()
  public async send(receiver: User, @TransactionManager() manager?: EntityManager): Promise<void> {
    if (manager === undefined) {
      return;
    }

    const conversation = await Conversation.findByUsers(this.sender, receiver);

    if (conversation.id === undefined) {
      await manager.save(conversation);
    }

    this.conversation = conversation;
    await manager.save(this);
    conversation.lastMessage = this;
    await manager.save(conversation);
  }

}
