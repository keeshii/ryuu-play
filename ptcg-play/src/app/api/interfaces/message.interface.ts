import { Response } from './response.interface';
import { ConversationInfo, UserInfo, MessageInfo } from 'ptcg-server';

export interface ConversationsResponse extends Response {
  conversations: ConversationInfo[];
  users: UserInfo[];
  total: number;
}

export interface MessagesResponse extends Response {
  messages: MessageInfo[];
  users: UserInfo[];
  total: number;
}

export interface MessageResponse extends Response {
  message: MessageInfo;
  user: UserInfo;
}
