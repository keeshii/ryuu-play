import { GameSettings, StateSerializer } from '../../game';
import { Client } from '../../game/client/client.interface';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { Core } from '../../game/core/core';
import { CoreInfo, GameInfo, PlayerInfo, GameState, UserInfo } from '../interfaces/core.interface';
import { SocketCache } from './socket-cache';
import { SocketWrapper, Response } from './socket-wrapper';
import { deepCompare } from '../../utils/utils';
import {Base64} from '../../utils';

export class CoreSocket {

  private client: Client;
  private socket: SocketWrapper;
  private core: Core;
  private cache: SocketCache;

  constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache) {
    this.cache = cache;
    this.client = client;
    this.socket = socket;
    this.core = core;

    // core listeners
    this.socket.addListener('core:getInfo', this.getCoreInfo.bind(this));
    this.socket.addListener('core:createGame', this.createGame.bind(this));
  }

  public onConnect(client: Client): void {
    this.socket.emit('core:join', {
      clientId: client.id,
      user: CoreSocket.buildUserInfo(client.user)
    });
  }

  public onDisconnect(client: Client): void {
    this.socket.emit('core:leave', client.id);
  }

  public onGameAdd(game: Game): void {
    this.cache.lastLogIdCache[game.id] = 0;
    this.cache.gameInfoCache[game.id] = CoreSocket.buildGameInfo(game);
    this.socket.emit('core:createGame', this.cache.gameInfoCache[game.id]);
  }

  public onGameDelete(game: Game): void {
    delete this.cache.gameInfoCache[game.id];
    delete this.cache.lastLogIdCache[game.id];
    this.socket.emit('core:deleteGame', game.id);
  }

  public onStateChange(game: Game, state: State): void {
    const gameInfo = CoreSocket.buildGameInfo(game);
    if (!deepCompare(gameInfo, this.cache.gameInfoCache[game.id])) {
      this.cache.gameInfoCache[game.id] = gameInfo;
      this.socket.emit('core:gameInfo', gameInfo);
    }
  }

  public onUsersUpdate(users: User[]): void {
    const core = this.client.core;
    if (core === undefined) {
      return;
    }
    const userInfos = users.map(u => {
      const connected = core.clients.some(c => c.user.id === u.id);
      return CoreSocket.buildUserInfo(u, connected);
    });
    this.socket.emit('core:usersInfo', userInfos);
  }

  private buildCoreInfo(): CoreInfo {
    return {
      clientId: this.client.id,
      clients: this.core.clients.map(client => ({
        clientId: client.id,
        userId: client.user.id
      })),
      users: this.core.clients.map(client => CoreSocket.buildUserInfo(client.user)),
      games: this.core.games.map(game => CoreSocket.buildGameInfo(game))
    };
  }

  private getCoreInfo(data: void, response: Response<CoreInfo>): void {
    response('ok', this.buildCoreInfo());
  }

  private createGame(params: { deck: string[], gameSettings: GameSettings, clientId?: number },
    response: Response<GameState>): void {
    const invited = this.core.clients.find(c => c.id === params.clientId);
    const game = this.core.createGame(this.client, params.deck, params.gameSettings, invited);
    response('ok', CoreSocket.buildGameState(game));
  }

  public static buildUserInfo(user: User, connected: boolean = true): UserInfo {
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

  private static buildGameInfo(game: Game): GameInfo {
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

  public static buildGameState(game: Game): GameState {
    const serializer = new StateSerializer();
    const serializedState = serializer.serialize(game.state);
    const base64 = new Base64();
    const stateData = base64.encode(serializedState);
    return {
      gameId: game.id,
      stateData,
      clientIds: game.clients.map(client => client.id)
    };
  }

}
