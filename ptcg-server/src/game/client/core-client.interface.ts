import { Core } from '../core/core';
import { Game } from '../core/game';
import { User } from '../../storage';
import { Client } from './client.interface';

export interface CoreClient {

  core: Core | undefined;

  games: Game[];

  onConnect(client: Client): void;

  onDisconnect(client: Client): void;

  onUsersUpdate(users: User[]): void;

  onGameAdd(game: Game): void;

  onGameDelete(game: Game): void;

  onGameJoin(game: Game, client: Client): void;

  onGameLeave(game: Game, client: Client): void;

}
