import { LobbyRoom } from '../rooms/lobby-room';
import { GameClient } from '../rooms/game-room';
import { User } from '../../storage';

export interface Bot {
  user: User;
  lobbyRoom: LobbyRoom;

  createGame(): GameClient;
  joinGame(gameId: number): GameClient;
  playGame(game: GameClient, deck: string[]): void;
}
