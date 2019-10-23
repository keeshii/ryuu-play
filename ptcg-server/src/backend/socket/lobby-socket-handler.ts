import { LobbyRoom } from '../../game/rooms/lobby-room';
import { LobbyInfo, GameInfo, UserInfo } from '../../game/rooms/rooms.interface';
import { Socket } from './socket.interface';
import { SocketHandler, Response } from './socket-handler';
import { WebSocketServer } from './websocket-server';

export class LobbySocketHandler extends SocketHandler {

  constructor(ws: WebSocketServer, private lobbyRoom: LobbyRoom) {
    super(ws);

    this.addListener('lobby:getInfo', this.getLobbyInfo.bind(this));
    this.addListener('lobby:createGame', this.createGame.bind(this));

    this.lobbyRoom.on('lobby:join', this.onJoin.bind(this));
    this.lobbyRoom.on('lobby:leave', this.onLeave.bind(this));
    this.lobbyRoom.on('lobby:createGame', this.onCreateGame.bind(this));
    this.lobbyRoom.on('lobby:deleteGame', this.onDeleteGame.bind(this));
  }

  protected onSocketConnection(socket: Socket): void {
    const user = socket.user;
    const client = this.lobbyRoom.join(user);
    socket.lobbyClient = client;
    socket.join('lobby');
  }

  protected onSocketDisconnection(socket: Socket): void {
    socket.lobbyClient.leave();
    socket.leaveAll();
  }

  private getLobbyInfo(socket: Socket, data: void, response: Response<LobbyInfo>): void {
    const lobbyInfo = this.lobbyRoom.getLobbyInfo();
    response('ok', lobbyInfo);
  }

  private createGame(socket: Socket, data: void, response: Response<GameInfo>): void {
    const gameRoom = this.lobbyRoom.createGame(socket.lobbyClient);
    response('ok', gameRoom.room.gameInfo);
  }

  private onJoin(userInfo: UserInfo): void {
    this.io.to('lobby').emit('lobby:join', userInfo);
  }

  private onLeave(userInfo: UserInfo): void {
    this.io.to('lobby').emit('lobby:leave', userInfo);
  }

  private onCreateGame(gameId: number): void {
    const game = this.lobbyRoom.getGame(gameId);
    if (game !== undefined) {
      this.io.to('lobby').emit('lobby:createGame', game.gameInfo);
    }
  }

  private onDeleteGame(gameId: number): void {
    this.io.to('lobby').emit('lobby:deleteGame', gameId);
  }

}
