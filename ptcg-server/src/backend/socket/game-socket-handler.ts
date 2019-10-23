import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { GameClient } from '../../game/rooms/game-room';
import { LobbyRoom } from '../../game/rooms/lobby-room';
import { GameInfo } from '../../game/rooms/rooms.interface';
import { Socket } from './socket.interface';
import { SocketHandler, Response } from './socket-handler';
import { WebSocketServer } from './websocket-server';

export class GameSocketHandler extends SocketHandler {

  constructor(ws: WebSocketServer, private lobbyRoom: LobbyRoom) {
    super(ws);

    this.addListener('game:join', this.joinGame.bind(this));
    this.addListener('game:leave', this.leaveGame.bind(this));

    this.lobbyRoom.on('game:join', this.onJoin.bind(this));
    this.lobbyRoom.on('game:leave', this.onLeave.bind(this));
  }

  private joinGame(socket: Socket, gameId: number, response: Response<GameInfo>): void {
    const gameRoom = this.lobbyRoom.getGame(gameId);
    if (gameRoom === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    gameRoom.join(socket.lobbyClient);
    socket.join('game[' + gameRoom.id + ']');
    response('ok', gameRoom.gameInfo);
  }

  private leaveGame(socket: Socket, gameId: number, response: Response<void>): void {
    const gameRoom = this.lobbyRoom.getGame(gameId);
    if (gameRoom === undefined) {
      return response('error', Errors.GAME_INVALID_ID);
    }
    const gameClient = gameRoom.findClient(socket.lobbyClient);
    if (gameClient !== undefined) {
      gameRoom.leave(gameClient);
      socket.leave('game[' + gameRoom.id + ']');
      response('ok');
    }
  }

  private onJoin(gameClient: GameClient): void {
    this.toRoom(gameClient).emit('game:join', {
      gameId: gameClient.room.id,
      userInfo: gameClient.userInfo
    });
  }

  private onLeave(gameClient: GameClient): void {
    this.toRoom(gameClient).emit('game:leave', {
      gameId: gameClient.room.id,
      userInfo: gameClient.userInfo
    });
  }

  private toRoom(gameClient: GameClient): io.Namespace {
    return this.io.to('game[' + gameClient.room.id + ']');
  }
}
