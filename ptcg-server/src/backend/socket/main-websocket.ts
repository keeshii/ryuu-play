import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { Main, MainConnection, MainHandler } from '../../game/core/main';
import { Game } from '../../game/core/game';
import { Response, Websocket } from './websocket';
import { User } from '../../storage';
import { validateToken } from '../services/auth-token';

interface AuthSocket extends io.Socket {
  main: MainConnection;
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

export class MainWebsocket extends Websocket implements MainHandler {

  private main: Main;
  private sockets: AuthSocket[] = [];

  constructor() {
    super();
    this.main = new Main();

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
    const mainConnection = this.main.connect(user, this);
    socket.main = mainConnection;
    this.sockets.push(socket);
  }

  protected onSocketDisconnection(socket: AuthSocket): void {
    socket.main.disconnect();
    const index = this.sockets.indexOf(socket);
    if (index !== -1) {
      this.sockets.splice(index, 1);
    }
  }

  private refresh(socket: AuthSocket, data: void, response: Response<MainRefreshResponse>): void {
    const users: MainUser[] = this.main.users.map(user => ({
      name: user.name,
      email: user.email
    }));
    const games = this.main.games.map(game => ({
      id: game.id,
      data: 'data',
      userCount: game.getConnectionsCount()
    }));
    response('ok', {
      games: games,
      users: users
    });
  }

  public onConnect(user: User): void {
    this.sockets.forEach(socket => socket.emit('main:connected'));
  }

  public onDisconnect(user: User): void { }

  public onGameAdd(game: Game): void { }

  public onGameDelete(game: Game): void { }

  public onGameStatus(game: Game): void { }

}
