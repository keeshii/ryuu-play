import { Client } from './client.interface';
import { Message } from '../../storage/model/message';
import { User } from '../../storage/model/user';

export interface MessageClient {

  onMessage(from: Client, message: Message): void;

  onMessageRead(user: User): void;

}
