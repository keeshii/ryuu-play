import * as io from 'socket.io';
import { AddPlayerAction, AppendLogAction, Action, PassTurnAction,
  ReorderHandAction, ReorderBenchAction, PlayCardAction, CardTarget,
  RetreatAction, AttackAction, UseAbilityAction, GameSettings } from '../../game';
import { Client } from '../../game/core/client';
import { Errors } from '../common/errors';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { Core } from '../../game/core/core';
import { CoreInfo, GameInfo, PlayerInfo, ClientInfo, GameState } from '../interfaces/core.interface';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { deepCompare } from '../../utils/utils';

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
  private gameInfoCache: {[id: number]: GameInfo} = {};
  private lastLogIdCache: {[id: number]: number} = {};

  constructor(user: User, core: Core, io: io.Server, socket: io.Socket) {
    super(user);
    this.core = core;
    this.io = io;
    this.socket = socket;

    // core listeners
    this.addListener('core:getInfo', this.getCoreInfo.bind(this));
    this.addListener('core:createGame', this.createGame.bind(this));

    // game listeners
    this.addListener('game:join', this.joinGame.bind(this));
    this.addListener('game:leave', this.leaveGame.bind(this));
    this.addListener('game:getStatus', this.getGameStatus.bind(this));
    this.addListener('game:action:ability', this.ability.bind(this));
    this.addListener('game:action:attack', this.attack.bind(this));
    this.addListener('game:action:play', this.playGame.bind(this));
    this.addListener('game:action:playCard', this.playCard.bind(this));
    this.addListener('game:action:resolvePrompt', this.resolvePrompt.bind(this));
    this.addListener('game:action:retreat', this.retreat.bind(this));
    this.addListener('game:action:reorderBench', this.reorderBench.bind(this));
    this.addListener('game:action:reorderHand', this.reorderHand.bind(this));
    this.addListener('game:action:passTurn', this.passTurn.bind(this));
    this.addListener('game:action:appendLog', this.appendLog.bind(this));
  }

  public onConnect(client: Client): void {
    this.socket.emit('core:join', this.buildClientInfo(client));
  }

  public onDisconnect(client: Client): void {
    this.socket.emit('core:leave', this.buildClientInfo(client));
  }

  public onGameAdd(game: Game): void {
    this.lastLogIdCache[game.id] = 0;
    this.gameInfoCache[game.id] = this.buildGameInfo(game);
    this.socket.emit('core:createGame', this.gameInfoCache[game.id]);
  }

  public onGameDelete(game: Game): void {
    delete this.gameInfoCache[game.id];
    delete this.lastLogIdCache[game.id];
    this.socket.emit('core:deleteGame', game.id);
  }

  public onStateChange(game: Game, state: State): void {
    const gameInfo = this.buildGameInfo(game);
    if (!deepCompare(gameInfo, this.gameInfoCache[game.id])) {
      this.gameInfoCache[game.id] = gameInfo;
      this.socket.emit('core:gameInfo', gameInfo);
    }

    if (this.games.indexOf(game) !== -1) {
      state = this.filterState(game.id, state);
      this.socket.emit(`game[${game.id}]:stateChange`, state);
    }
  }

  public onGameJoin(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:join`, this.buildClientInfo(client));
  }

  public onGameLeave(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:leave`, this.buildClientInfo(client));
  }

  public attachListeners(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      this.socket.on(listener.message, async <T, R>(data: T, fn: Function) => {
        const response: Response<R> =
          (message: string, data?: R | Errors) => fn && fn({message, data});
        try {
          await listener.handler(data, response);
        } catch(error) {
          response('error', error.message);
        }
      });
    }
  }

  /**
   * Clear sensitive data, resolved prompts and old logs.
   */
  private filterState(gameId: number, state: State): State {
    state = { ...state };
    const lastLogId = this.lastLogIdCache[gameId];
    state.prompts = state.prompts.filter(prompt => prompt.result === undefined);
    state.logs = state.logs.filter(log => log.id > lastLogId);
    if (state.logs.length > 0) {
      this.lastLogIdCache[gameId] = state.logs[state.logs.length - 1].id;
    }
    return state;
  }

  private addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  private buildClientInfo(client: Client): ClientInfo {
    return {
      clientId: client.id,
      userId: client.user.id,
      name: client.user.name,
      ranking: client.user.ranking,
      rang: client.user.rang,
      avatarFile: client.user.avatarFile
    };
  }

  private buildGameInfo(game: Game): GameInfo {
    const state = game.state;
    const players: PlayerInfo[] = state.players.map(player => ({
      clientId: player.id,
      name: player.name,
      prizes: player.prizes.reduce((sum, cardList) => sum + cardList.cards.length, 0),
      deck: player.deck.cards.length
    }));
    return {
      gameId: game.id,
      phase: state.phase,
      turn: state.turn,
      activePlayer: state.activePlayer,
      players: players
    };
  }

  private buildGameState(game: Game): GameState {
    return {
      gameId: game.id,
      state: game.state,
      users: game.clients.map(client => this.buildClientInfo(client))
    };
  }

  private buildCoreInfo(): CoreInfo {
    return {
      clientId: this.id,
      users: this.core.clients.map(client => this.buildClientInfo(client)),
      games: this.core.games.map(game => this.buildGameInfo(game))
    };
  }

  private getCoreInfo(data: void, response: Response<CoreInfo>): void {
    response('ok', this.buildCoreInfo());
  }

  private createGame(params: { deck: string[], gameSettings: GameSettings }, response: Response<GameState>): void {
    const game = this.core.createGame(this, params.deck, params.gameSettings);
    response('ok', this.buildGameState(game));
  }

  private joinGame(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    this.lastLogIdCache[game.id] = 0;
    this.core.joinGame(this, game);
    response('ok', this.buildGameState(game));
  }

  private leaveGame(gameId: number, response: Response<void>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    delete this.lastLogIdCache[game.id];
    this.core.leaveGame(this, game);
    response('ok');
  }

  private getGameStatus(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    response('ok', this.buildGameState(game));
  }

  private dispatch(gameId: number, action: Action, response: Response<void>) {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    try {
      game.dispatch(this, action);
    } catch (error) {
      response('error', error.message);
    }
    response('ok');
  }

  private ability(params: {gameId: number, ability: string, target: CardTarget}, response: Response<void>) {
    const action = new UseAbilityAction(this.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private attack(params: {gameId: number, attack: string}, response: Response<void>) {
    const action = new AttackAction(this.id, params.attack);
    this.dispatch(params.gameId, action, response);
  }

  private playGame(params: {gameId: number, deck: string[]}, response: Response<void>) {
    const action = new AddPlayerAction(this.id, this.user.name, params.deck);
    this.dispatch(params.gameId, action, response);
  }

  private playCard(params: {gameId: number, handIndex: number, target: CardTarget}, response: Response<void>) {
    const action = new PlayCardAction(this.id, params.handIndex, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private resolvePrompt(params: {gameId: number, id: number, result: any}, response: Response<void>) {
    const game = this.core.games.find(g => g.id === params.gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    const prompt = game.state.prompts.find(p => p.id === params.id);
    if (prompt === undefined) {
      response('error', Errors.PROMPT_INVALID_ID);
      return;
    }

    try {
      params.result = prompt.decode(params.result, game.state);
      if (prompt.validate(params.result, game.state) === false) {
        response('error', Errors.PROMPT_INVALID_RESULT);
        return;
      }
    } catch (error) {
      response('error', error);
      return;
    }

    const action = new ResolvePromptAction(params.id, params.result);
    this.dispatch(params.gameId, action, response);
  }

  private reorderBench(params: {gameId: number, from: number, to: number}, response: Response<void>) {
    const action = new ReorderBenchAction(this.id, params.from, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private reorderHand(params: {gameId: number, order: number[]}, response: Response<void>) {
    const action = new ReorderHandAction(this.id, params.order);
    this.dispatch(params.gameId, action, response);
  }

  private retreat(params: {gameId: number, to: number}, response: Response<void>) {
    const action = new RetreatAction(this.id, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private passTurn(params: {gameId: number}, response: Response<void>) {
    const action = new PassTurnAction(this.id);
    this.dispatch(params.gameId, action, response);
  }

  private appendLog(params: {gameId: number, message: string}, response: Response<void>) {
    const action = new AppendLogAction(this.id, params.message);
    this.dispatch(params.gameId, action, response);
  }

}
