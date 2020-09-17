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
import { CoreInfo, GameInfo, PlayerInfo, GameState, UserInfo } from '../interfaces/core.interface';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SocketWrapper, Response } from './socket-wrapper';
import { deepCompare } from '../../utils/utils';

export class ClientSocket extends Client {

  public core: Core;
  private socket: SocketWrapper;
  private gameInfoCache: {[id: number]: GameInfo} = {};
  private lastLogIdCache: {[id: number]: number} = {};

  constructor(user: User, core: Core, io: io.Server, socket: io.Socket) {
    super(user);
    this.socket = new SocketWrapper(io, socket);
    this.core = core;

    // core listeners
    this.socket.addListener('core:getInfo', this.getCoreInfo.bind(this));
    this.socket.addListener('core:createGame', this.createGame.bind(this));

    // game listeners
    this.socket.addListener('game:join', this.joinGame.bind(this));
    this.socket.addListener('game:leave', this.leaveGame.bind(this));
    this.socket.addListener('game:getStatus', this.getGameStatus.bind(this));
    this.socket.addListener('game:action:ability', this.ability.bind(this));
    this.socket.addListener('game:action:attack', this.attack.bind(this));
    this.socket.addListener('game:action:play', this.playGame.bind(this));
    this.socket.addListener('game:action:playCard', this.playCard.bind(this));
    this.socket.addListener('game:action:resolvePrompt', this.resolvePrompt.bind(this));
    this.socket.addListener('game:action:retreat', this.retreat.bind(this));
    this.socket.addListener('game:action:reorderBench', this.reorderBench.bind(this));
    this.socket.addListener('game:action:reorderHand', this.reorderHand.bind(this));
    this.socket.addListener('game:action:passTurn', this.passTurn.bind(this));
    this.socket.addListener('game:action:appendLog', this.appendLog.bind(this));
  }

  public onConnect(client: Client): void {
    this.socket.emit('core:join', {
      clientId: client.id,
      user: this.buildUserInfo(client.user)
    });
  }

  public onDisconnect(client: Client): void {
    this.socket.emit('core:leave', client.id);
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

  public onUsersUpdate(users: User[]): void {
    const userInfos = users.map(u => {
      const connected = this.core.clients.some(c => c.user.id === u.id);
      return this.buildUserInfo(u, connected);
    });
    this.socket.emit('core:usersInfo', userInfos);
  }

  public onGameJoin(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
  }

  public onGameLeave(game: Game, client: Client): void {
    this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
  }

  public attachListeners(): void {
    this.socket.attachListeners();
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

  private buildUserInfo(user: User, connected: boolean = true): UserInfo {
    return {
      connected,
      userId: user.id,
      name: user.name,
      email: user.email,
      registered: user.registered,
      lastSeen: user.lastSeen,
      ranking: user.ranking,
      rank: user.getRank(),
      lastRankingChange: user.lastRankingChange,
      avatarFile: user.avatarFile
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
      clientIds: game.clients.map(client => client.id)
    };
  }

  private buildCoreInfo(): CoreInfo {
    return {
      clientId: this.id,
      clients: this.core.clients.map(client => ({
        clientId: client.id,
        userId: client.user.id
      })),
      users: this.core.clients.map(client => this.buildUserInfo(client.user)),
      games: this.core.games.map(game => this.buildGameInfo(game))
    };
  }

  private getCoreInfo(data: void, response: Response<CoreInfo>): void {
    response('ok', this.buildCoreInfo());
  }

  private createGame(params: { deck: string[], gameSettings: GameSettings, clientId?: number },
    response: Response<GameState>): void {
    const invited = this.core.clients.find(c => c.id === params.clientId);
    const game = this.core.createGame(this, params.deck, params.gameSettings, invited);
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
