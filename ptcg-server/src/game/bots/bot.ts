import { LobbyRoom } from '../core/lobby-room';
import { GameRoom } from '../core/game-room';
import { User } from '../../storage';
import { RoomClient } from '../core/room-client';

export interface Bot {
  user: User;
  lobbyRoom: LobbyRoom;

  createGame(): RoomClient<GameRoom>;
  joinGame(gameId: number): RoomClient<GameRoom>;
  playGame(game: RoomClient<GameRoom>, deck: string[]): void;
}
