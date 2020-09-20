import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageInfo, ConversationInfo, UserInfo } from 'ptcg-server';

import { ApiService } from '../api.service';
import { ConversationsResponse, MessagesResponse, MessageResponse } from '../interfaces/message.interface';
import { SessionService } from '../../shared/session/session.service';
import { SocketService } from '../socket.service';


@Injectable()
export class MessageService {

  constructor(
    private api: ApiService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) {}

  public init() {
    this.socketService.on('message:received', (
      data: {message: MessageInfo, user: UserInfo}
    ) => this.onMessageReceived(data.message, data.user));

    this.socketService.on('message:read', (
      data: {user: UserInfo}
    ) => this.onMessageRead(data.user));
  }

  public getConversations() {
    return this.api.get<ConversationsResponse>('/v1/messages/list');
  }

  public setSessionConversations(
    newConversations: ConversationInfo[],
    newUsers: UserInfo[]
  ): void {
    const users = { ...this.sessionService.session.users };
    for (const user of newUsers) {
      users[user.userId] = user;
    }

    const conversations = this.sessionService.session.conversations.slice();
    for (const c of newConversations) {
      const index = conversations.findIndex(co => {
        return co.user1Id === c.user1Id && co.user2Id === c.user2Id;
      });
      if (index !== -1) {
        conversations[index] = c;
      } else {
        conversations.push(c);
      }
    }
    this.sessionService.set({ conversations, users });
  }

  public getConversation(userId: number) {
    return this.api.get<MessagesResponse>('/v1/messages/get/' + userId);
  }

  public deleteMessages(userId: number): Observable<Response> {
    return this.api.post<Response>('/v1/messages/deleteMessages', { id: userId });
  }

  public sendMessage(userId: number, text: string): Observable<MessageResponse> {
    return this.socketService.emit('message:send', { userId, text });
  }

  public readMessages(userId: number): Observable<Response> {
    return this.socketService.emit('message:read', { userId });
  }

  private onMessageReceived(message: MessageInfo, user: UserInfo) {
    const loggedUserId = this.sessionService.session.loggedUserId;
    const senderId = message.senderId;

    let conversation = this.sessionService.session.conversations.find(c => {
      return (c.user1Id === loggedUserId && c.user2Id === senderId)
        || (c.user1Id === senderId && c.user2Id === loggedUserId);
    });

    if (conversation === undefined) {
      conversation = {
        user1Id: senderId,
        user2Id: loggedUserId,
        lastMessage: message
      };
    } else {
      conversation = { ...conversation, lastMessage: message };
    }

    this.setSessionConversations([conversation], [user]);
  }

  private onMessageRead(user: UserInfo) {
    const loggedUserId = this.sessionService.session.loggedUserId;
    const userId = user.userId;

    let conversation = this.sessionService.session.conversations.find(c => {
      return (c.user1Id === loggedUserId && c.user2Id === userId)
        || (c.user1Id === userId && c.user2Id === loggedUserId);
    });

    if (conversation !== undefined) {
      const lastMessage = { ...conversation.lastMessage, isRead: true };
      conversation = { ...conversation, lastMessage };
    }

    this.setSessionConversations([conversation], [user]);
  }

}
