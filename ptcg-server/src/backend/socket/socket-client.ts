import * as io from 'socket.io';
import { Client } from '../../game/core/client';
import { Errors } from '../common/errors';
import { Game } from '../../game/core/game';
import { CoreInfo, GameInfo, GameState } from '../../game/core/core.interface';
import { Prompt } from '../../game/store/prompts/prompt';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { Core } from '../../game/core/core';

type Response<R = void> = (message: string, data?: R | Errors) => void;

type Handler<T, R> = (data: T, response: Response<R>) => void;

interface Listener<T, R> {
  message: string,
  handler: Handler<T, R>
}

export class SocketClient extends Client {

  public io: io.Server;
  public socket: io.Socket;
  public core: Core;
  private listeners: Listener<any, any>[] = [];

  constructor(user: User, core: Core, io: io.Server, socket: io.Socket) {
    super(user);
    this.core = core;
    this.io = io;
    this.socket = socket;

    // core listeners
    this.addListener('lobby:getInfo', this.getCoreInfo.bind(this));
    this.addListener('lobby:createGame', this.createGame.bind(this));

    // game listeners
    this.addListener('game:join', this.joinGame.bind(this));
    this.addListener('game:leave', this.leaveGame.bind(this));
    this.addListener('game:getStatus', this.getGameStatus.bind(this));
  }

  public onConnect(client: Client): void {
    this.socket.emit('lobby:join', client.userInfo);
  }

  public onDisconnect(client: Client): void {
    this.socket.emit('lobby:leave', client.userInfo);
  }

  public onGameJoin(client: Client, game: Game): void {
    this.socket.emit(`game[${game.id}]:join`, client.userInfo);    
  }

  public onGameLeave(client: Client, game: Game): void {
    this.socket.emit(`game[${game.id}]:leave`, client.userInfo);    
  }

  public onGameInfo(game: Game): void {
    this.socket.emit(`game[${game.id}]:gameInfo`, game.gameInfo);    
  }

  public onGameAdd(game: Game): void {
      this.socket.emit('lobby:createGame', game.gameInfo);
  }

  public onGameDelete(game: Game): void {
    this.socket.emit('lobby:deleteGame', game.id);
  }

  public onStateStable(game: Game, state: State): void {
    this.socket.emit(`game[${game.id}]:stateStable`, state);    
  }

  public onStateChange(game: Game, state: State): void {
    this.socket.emit(`game[${game.id}]:stateChange`, state);        
  }

  public resolvePrompt(game: Game, prompt: Prompt<any>): boolean {
    return false;
  }

  public attachListeners(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      this.socket.on(listener.message, <T, R>(data: T, fn: Function) => {
        const response: Response<R> =
          (message: string, data?: R | Errors) => fn && fn({message, data});
        try {
          listener.handler(data, response);
        } catch(error) {
          response('error', error);
        }
      });
    }
  }

  private addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  private getCoreInfo(data: void, response: Response<CoreInfo>): void {
    response('ok', this.core.coreInfo);
  }

  private createGame(data: void, response: Response<GameInfo>): void {
    const game = this.core.createGame(this);
    response('ok', game.gameInfo);
  }

  private joinGame(gameId: number, response: Response<GameState>): void {
    const game = this.core.getGame(gameId);
    this.core.joinGame(this, game);
    response('ok', game.gameState);
  }

  private leaveGame(gameId: number, response: Response<void>): void {
    const game = this.core.getGame(gameId);
    this.core.leaveGame(this, game);
    response('ok');
  }

  private getGameStatus(gameId: number, response: Response<GameState>): void {
    const game = this.core.getGame(gameId);
    response('ok', game.gameState);
  }

}
