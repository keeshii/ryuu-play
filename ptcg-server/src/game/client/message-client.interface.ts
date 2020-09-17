import { Client } from './client.interface';

export interface MessageClient {

  onMessage(from: Client, message: string): void;

}
