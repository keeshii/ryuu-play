import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { ConversationsResponse } from '../interfaces/message.interface';


@Injectable()
export class MessageService {

  constructor(
    private api: ApiService,
  ) {}

  public getConversations() {
    return this.api.get<ConversationsResponse>('/v1/messages/conversations');
  }

}
