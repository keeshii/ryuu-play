import * as io from 'socket.io';
import { LobbyClient } from '../../game/rooms/lobby-room';
import { User } from '../../storage';

export interface Socket extends io.Socket {
  lobbyClient: LobbyClient;
  user: User;
}
