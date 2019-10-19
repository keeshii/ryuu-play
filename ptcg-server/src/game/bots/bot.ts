import { LobbyRoom } from '../rooms/lobby-room';
import { GameRoom } from '../rooms/game-room';
import { User } from '../../storage';
import { RoomClient } from '../rooms/room-client';

export interface Bot {
  user: User;
  lobbyRoom: LobbyRoom;

  createGame(): RoomClient<GameRoom>;
  joinGame(gameId: number): RoomClient<GameRoom>;
  playGame(game: RoomClient<GameRoom>, deck: string[]): void;
}
