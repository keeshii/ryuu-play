import { User } from '../../storage';
import { CoreClient } from './core-client.interface';
import { GameClient } from './game-client.interface';
import { MessageClient } from './message-client.interface';

export interface Client extends CoreClient, GameClient, MessageClient {

  id: number;
  name: string;
  user: User;

}
