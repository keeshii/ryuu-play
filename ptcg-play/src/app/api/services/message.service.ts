import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';
import { ConversationsResponse, MessagesResponse } from '../interfaces/message.interface';
import { SocketService } from '../socket.service';


@Injectable()
export class MessageService {

  constructor(
    private api: ApiService,
    private socketService: SocketService
  ) {}

  public init() {
    // this.socketService.on('message:received')
  }

  public getConversations() {
    return this.api.get<ConversationsResponse>('/v1/messages/list');
  }

  public getConversation(userId: number) {
    return this.api.get<MessagesResponse>('/v1/messages/get/' + userId);
  }

  public sendMessage(userId: number, text: string): Observable<Response> {
    return this.socketService.emit('message:send', { userId, text });
  }

}
