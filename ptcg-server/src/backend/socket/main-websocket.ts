import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { LobbyRoom } from '../../game/core/lobby-room';
import { Response, Websocket } from './websocket';
import { RoomClient } from '../../game/core/room-client';
import { User } from '../../storage';
import { validateToken } from '../services/auth-token';

interface AuthSocket extends io.Socket {
  lobbyClient: RoomClient<LobbyRoom>;
  user: User;
}

interface MainUser {
  name: string;
  email: string;
}

interface MainGame {
  id: number;
  data: string;
  userCount: number;
}

interface MainRefreshResponse {
  games: MainGame[],
  users: MainUser[]
}

export class MainWebsocket extends Websocket {

  private lobbyRoom: LobbyRoom;
  private sockets: AuthSocket[] = [];

  constructor() {
    super();
    this.lobbyRoom = new LobbyRoom();

    this.addMiddleware((socket, next) => this.authSocket(socket, next));
    this.addListener('main:refresh', this.refresh.bind(this));
  }

  private async authSocket(socket: io.Socket, next: (err?: any) => void): Promise<void> {
    const token: string = socket.handshake.query && socket.handshake.query.token;
    const userId = validateToken(token);

    if (userId === 0) {
      return next(new Error(Errors.AUTH_TOKEN_INVALID));
    }

    const user = await User.findOne(userId);
    if (user === undefined) {
      return next(new Error(Errors.AUTH_TOKEN_INVALID));
    }

    (socket as AuthSocket).user = user;
    next();
  }

  protected onSocketConnection(socket: AuthSocket): void {
    const user = socket.user;
    const client = this.lobbyRoom.join(user);
    socket.lobbyClient = client;
    this.sockets.push(socket);
  }

  protected onSocketDisconnection(socket: AuthSocket): void {
    socket.lobbyClient.leave();
    const index = this.sockets.indexOf(socket);
    if (index !== -1) {
      this.sockets.splice(index, 1);
    }
  }

  private refresh(socket: AuthSocket, data: void, response: Response<MainRefreshResponse>): void {
  }

}
