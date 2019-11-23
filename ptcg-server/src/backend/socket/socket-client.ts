import * as io from 'socket.io';
import { Client } from '../../game/core/client';
import { Game } from '../../game/core/game';
import { Prompt } from '../../game/store/prompts/prompt';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';

export class SocketClient extends Client {

  public io: io.Server;
  public socket: io.Socket;

  constructor(user: User, io: io.Server, socket: io.Socket) {
    super(user);
    this.io = io;
    this.socket = socket;
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

}
