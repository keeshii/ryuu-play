import { Request, Response } from 'express';
import { FindConditions } from 'typeorm';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Conversation, Message, User } from '../../storage';
import { ConversationInfo, MessageInfo } from '../interfaces/message.interface';
import { Errors } from '../common/errors';
import { UserInfo } from '../interfaces/core.interface';
import { config } from '../../config';

export class Messages extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;

    const [conversationRows, total] = await this.db.manager.connection
      .getRepository(Conversation)
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.lastMessage', 'lastMessage')
      .where('c.user1 = :userId AND lastMessage.isDeletedByUser1 = false', { userId })
      .orWhere('c.user2 = :userId AND lastMessage.isDeletedByUser2 = false', { userId })
      .orderBy('lastMessage.created', 'DESC')
      .getManyAndCount();

    const users: UserInfo[] = [];
    conversationRows.forEach(c => {
      if (!users.some(u => u.userId === c.user1.id)) {
        users.push(this.buildUserInfo(c.user1));
      }
      if (!users.some(u => u.userId === c.user2.id)) {
        users.push(this.buildUserInfo(c.user2));
      }
    });

    const conversations: ConversationInfo[] = conversationRows.map(c => ({
      user1Id: c.user1.id,
      user2Id: c.user2.id,
      lastMessage: {
        messageId: c.lastMessage.id,
        senderId: c.lastMessage.sender.id,
        created: c.lastMessage.created,
        isRead: c.lastMessage.isRead,
        text: c.lastMessage.text
      }
    }));

    res.send({ok: true, conversations, users, total});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const defaultPageSize = config.backend.defaultPageSize;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;

    const user1 = await User.findOne(userId);
    const user2 = await User.findOne(parseInt(req.params.id, 10));
    if (user1 === undefined || user2 === undefined) {
      res.status(400);
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    const conversation = await Conversation.findByUsers(user1, user2);

    const users: UserInfo[] = [
      this.buildUserInfo(conversation.user1),
      this.buildUserInfo(conversation.user2)
    ];

    if (conversation.id === 0) {
      res.send({ok: true, messages: [], users, total: 0});
      return;
    }

    const where: FindConditions<Message> = { conversation: { id: conversation.id } };
    if (conversation.user1.id === userId) {
      where.isDeletedByUser1 = false;
    }
    if (conversation.user2.id === userId) {
      where.isDeletedByUser2 = false;
    }

    const [messageRows, total] = await Message.findAndCount({
      relations: ['sender'],
      where,
      order: { created: "DESC" },
      skip: page * pageSize,
      take: pageSize
    });

    const messages: MessageInfo[] = messageRows.map(m => ({
      messageId: m.id,
      senderId: m.sender.id,
      created: m.created,
      isRead: m.isRead,
      text: m.text
    }));

    res.send({ok: true, messages, users, total});
  }

}
