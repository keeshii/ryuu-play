import { Response } from './response.interface';
import { ConversationInfo } from 'ptcg-server';

export interface ConversationsResponse extends Response {
  conversations: ConversationInfo[];
}
