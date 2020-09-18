import { Request, Response } from 'express';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Conversation } from '../../storage';
import { ConversationInfo } from '../interfaces/message.interface';

export class Messages extends Controller {

  @Get('/conversations')
  @AuthToken()
  public async onConversations(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const [conversationRows, total] = await this.db.manager.connection
      .getRepository(Conversation)
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.lastMessage', 'lastMessage')
      .where('c.user1 = :userId AND lastMessage.isDeletedByUser1 = false', { userId })
      .orWhere('c.user2 = :userId AND lastMessage.isDeletedByUser2 = false', { userId })
      .orderBy('lastMessage.created', 'DESC')
      .getManyAndCount();

    const conversations: ConversationInfo[] = conversationRows.map(c => ({
      user1: this.buildUserInfo(c.user1),
      user2: this.buildUserInfo(c.user2),
      lastMessage: {
        senderId: c.lastMessage.sender.id,
        created: c.lastMessage.created,
        isRead: c.lastMessage.isRead,
        text: c.lastMessage.text
      }
    }));

    res.send({ok: true, conversations, total});
  }

}
