import { AddPlayerAction, AppendLogAction, Action, PassTurnAction,
  ReorderHandAction, ReorderBenchAction, PlayCardAction, CardTarget,
  RetreatAction, AttackAction, UseAbilityAction, StateSerializer, UseStadiumAction } from '../../game';
import { Client } from '../../game/client/client.interface';
import { CoreSocket } from './core-socket';
import { Errors } from '../common/errors';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { Core } from '../../game/core/core';
import { GameState } from '../interfaces/core.interface';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SocketCache } from './socket-cache';
import { SocketWrapper, Response } from './socket-wrapper';
import {Base64} from '../../utils';
import {ChangeAvatarAction} from '../../game/store/actions/change-avatar-action';

export class GameSocket {

  private cache: SocketCache;
  private client: Client;
  private socket: SocketWrapper;
  private core: Core;

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;

    // game listeners
    this.socket.addListener('game:join', this.joinGame.bind(this));
    this.socket.addListener('game:leave', this.leaveGame.bind(this));
    this.socket.addListener('game:getStatus', this.getGameStatus.bind(this));
    this.socket.addListener('game:action:ability', this.ability.bind(this));
    this.socket.addListener('game:action:attack', this.attack.bind(this));
    this.socket.addListener('game:action:stadium', this.stadium.bind(this));
    this.socket.addListener('game:action:play', this.playGame.bind(this));
    this.socket.addListener('game:action:playCard', this.playCard.bind(this));
    this.socket.addListener('game:action:resolvePrompt', this.resolvePrompt.bind(this));
    this.socket.addListener('game:action:retreat', this.retreat.bind(this));
    this.socket.addListener('game:action:reorderBench', this.reorderBench.bind(this));
    this.socket.addListener('game:action:reorderHand', this.reorderHand.bind(this));
    this.socket.addListener('game:action:passTurn', this.passTurn.bind(this));
    this.socket.addListener('game:action:appendLog', this.appendLog.bind(this));
    this.socket.addListener('game:action:changeAvatar', this.changeAvatar.bind(this));
  }

  public onGameJoin(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
  }

  public onGameLeave(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
  }

  public onStateChange(game: Game, state: State): void {
    if (this.core.games.indexOf(game) !== -1) {
      state = this.filterState(game.id, state);

      const serializer = new StateSerializer();
      const serializedState = serializer.serialize(game.state);
      const base64 = new Base64();
      const stateData = base64.encode(serializedState);
      const playerStats = game.playerStats;
      this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
    }
  }

  /**
   * Clear sensitive data, resolved prompts and old logs.
   */
  private filterState(gameId: number, state: State): State {
    state = { ...state };
    const lastLogId = this.cache.lastLogIdCache[gameId];
    state.prompts = state.prompts.filter(prompt => prompt.result === undefined);
    state.logs = state.logs.filter(log => log.id > lastLogId);
    if (state.logs.length > 0) {
      this.cache.lastLogIdCache[gameId] = state.logs[state.logs.length - 1].id;
    }
    return state;
  }

  private joinGame(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    this.cache.lastLogIdCache[game.id] = 0;
    this.core.joinGame(this.client, game);
    response('ok', CoreSocket.buildGameState(game));
  }

  private leaveGame(gameId: number, response: Response<void>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    delete this.cache.lastLogIdCache[game.id];
    this.core.leaveGame(this.client, game);
    response('ok');
  }

  private getGameStatus(gameId: number, response: Response<GameState>): void {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    response('ok', CoreSocket.buildGameState(game));
  }

  private dispatch(gameId: number, action: Action, response: Response<void>) {
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      response('error', Errors.GAME_INVALID_ID);
      return;
    }
    try {
      game.dispatch(this.client, action);
    } catch (error) {
      response('error', error.message);
    }
    response('ok');
  }

  private ability(params: {gameId: number, ability: string, target: CardTarget}, response: Response<void>) {
    const action = new UseAbilityAction(this.client.id, params.ability, params.target);
    this.dispatch(params.gameId, action, response);
  }

  private attack(params: {gameId: number, attack: string}, response: Response<void>) {
    const action = new AttackAction(this.client.id, params.attack);
    this.dispatch(params.gameId, action, response);
  }

  private stadium(params: {gameId: number}, response: Response<void>) {
    const action = new UseStadiumAction(this.client.id);
    this.dispatch(params.gameId, action, response);
  }

  private playGame(params: {gameId: number, deck: string[]}, response: Response<void>) {
    const action = new AddPlayerAction(this.client.id, this.client.user.name, params.deck);
    this.dispatch(params.gameId, action, response);
  }

  private playCard(params: {gameId: number, handIndex: number, target: CardTarget}, response: Response<void>) {
    const action = new PlayCardAction(this.client.id, params.handIndex, params.target);
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
    const action = new ReorderBenchAction(this.client.id, params.from, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private reorderHand(params: {gameId: number, order: number[]}, response: Response<void>) {
    const action = new ReorderHandAction(this.client.id, params.order);
    this.dispatch(params.gameId, action, response);
  }

  private retreat(params: {gameId: number, to: number}, response: Response<void>) {
    const action = new RetreatAction(this.client.id, params.to);
    this.dispatch(params.gameId, action, response);
  }

  private passTurn(params: {gameId: number}, response: Response<void>) {
    const action = new PassTurnAction(this.client.id);
    this.dispatch(params.gameId, action, response);
  }

  private appendLog(params: {gameId: number, message: string}, response: Response<void>) {
    const action = new AppendLogAction(this.client.id, params.message);
    this.dispatch(params.gameId, action, response);
  }

  private changeAvatar(params: {gameId: number, avatarName: string}, response: Response<void>) {
    const action = new ChangeAvatarAction(this.client.id, params.avatarName);
    this.dispatch(params.gameId, action, response);
  }

}
