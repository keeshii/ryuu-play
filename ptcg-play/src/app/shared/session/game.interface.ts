import { State } from 'ptcg-server';
import { User } from './user.interface';

export interface Game {
  id: number;
  data: string;
  state: State;
  users: User;
}
