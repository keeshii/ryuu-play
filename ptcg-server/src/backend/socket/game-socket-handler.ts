import { Errors } from '../common/errors';
import { GameClient, GameRoom } from '../../game/rooms/game-room';
import { LobbyRoom } from '../../game/rooms/lobby-room';
import { GameState } from '../../game/rooms/rooms.interface';
import { Socket } from './socket.interface';
import { SocketHandler, Response } from './socket-handler';
import { WebSocketServer } from './websocket-server';

export class GameSocketHandler extends SocketHandler {

  constructor(ws: WebSocketServer, private lobbyRoom: LobbyRoom) {
    super(ws);

    this.addListener('game:join', this.joinGame.bind(this));
    this.addListener('game:leave', this.leaveGame.bind(this));
    this.addListener('game:getStatus', this.getStatus.bind(this));

    this.lobbyRoom.on('game:join', this.onJoin.bind(this));
    this.lobbyRoom.on('game:leave', this.onLeave.bind(this));
  }

  private joinGame(socket: Socket, gameId: number, response: Response<GameState>): void {
    const gameRoom = this.lobbyRoom.getGame(gameId);
    if (gameRoom === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    const gameClient = gameRoom.join(socket.lobbyClient);
    socket.join(this.getRoomName(gameRoom));
    response('ok', gameRoom.getGameState(gameClient));
  }

  private leaveGame(socket: Socket, gameId: number, response: Response<void>): void {
    const gameRoom = this.lobbyRoom.getGame(gameId);
    if (gameRoom === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    const gameClient = gameRoom.findClient(socket.lobbyClient);
    if (gameClient === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }

    gameRoom.leave(gameClient);
    socket.leave(this.getRoomName(gameRoom));
    response('ok');
  }

  private getStatus(socket: Socket, gameId: number, response: Response<GameState>): void {
    const gameRoom = this.lobbyRoom.getGame(gameId);
    if (gameRoom === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    const gameClient = gameRoom.findClient(socket.lobbyClient);
    if (gameClient === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    response('ok', gameRoom.getGameState(gameClient));
  }

  private onJoin(gameClient: GameClient): void {
    this.emit(gameClient, 'game[]:leave', gameClient.userInfo);
  }

  private onLeave(gameClient: GameClient): void {
    this.emit(gameClient, 'game[]:leave', gameClient.userInfo);
  }

  private getRoomName(room: GameRoom) {
    return 'game[' + room.id + ']';
  }

  private emit(gameClient: GameClient, message: string, data: any): void {
    const roomName = this.getRoomName(gameClient.room);
    const roomMessage = message.replace('game[]', roomName);
    this.io.to(roomName).emit(roomMessage, data);
  }

}
