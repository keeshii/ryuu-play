import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { LobbyRoom, LobbyClient } from '../../game/rooms/lobby-room';
import { LobbyInfo, GameInfo } from '../../game/rooms/game-info.interface';
import { Response, Websocket } from './websocket';
import { User } from '../../storage';
import { validateToken } from '../services/auth-token';

interface MainSocket extends io.Socket {
  lobbyClient: LobbyClient;
  user: User;
}

export class MainWebsocket extends Websocket {

  private lobbyRoom: LobbyRoom;
  private sockets: MainSocket[] = [];

  constructor() {
    super();
    this.lobbyRoom = new LobbyRoom();

    this.addMiddleware((socket, next) => this.authSocket(socket, next));
    this.addListener('lobby:getInfo', this.getLobbyInfo.bind(this));
    this.addListener('lobby:createGame', this.createGame.bind(this));

    this.lobbyRoom.on('lobby:deleteGame', this.deleteGame.bind(this));
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

    (socket as MainSocket).user = user;
    next();
  }

  protected onSocketConnection(socket: MainSocket): void {
    const user = socket.user;
    const client = this.lobbyRoom.join(user);
    socket.lobbyClient = client;
    this.sockets.push(socket);
  }

  protected onSocketDisconnection(socket: MainSocket): void {
    socket.lobbyClient.leave();
    const index = this.sockets.indexOf(socket);
    if (index !== -1) {
      this.sockets.splice(index, 1);
    }
  }

  private getLobbyInfo(socket: MainSocket, data: void, response: Response<LobbyInfo>): void {
    const lobbyInfo = this.lobbyRoom.getLobbyInfo();
    response('ok', lobbyInfo);
  }

  private createGame(socket: MainSocket, data: void, response: Response<GameInfo>): void {
    const gameRoom = this.lobbyRoom.createGame(socket.lobbyClient);
    response('ok', gameRoom.room.gameInfo);
  }

  private deleteGame(gameId: number): void {
    return;
  }

}
