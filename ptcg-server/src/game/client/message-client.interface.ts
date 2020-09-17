import { Client } from './client.interface';
import { Message } from '../../storage/model/message';

export interface MessageClient {

  onMessage(from: Client, message: Message): void;

}
