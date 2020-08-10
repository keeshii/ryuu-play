import { Injectable } from '@angular/core';
import { GameInfo, CoreInfo, ClientInfo, GameState, GameSettings } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiError } from '../api.error';
import { GameService } from './game.service';
import { SessionService } from '../../shared/session/session.service';
import { SocketService } from '../socket.service';

@Injectable()
export class MainService {

  public loading = false;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) { }

  public init(coreInfo: CoreInfo): void {
    this.sessionService.set({ clients: coreInfo.users, games: coreInfo.games, clientId: coreInfo.clientId });
    this.socketService.on('core:join', (userInfo: ClientInfo) => this.onJoin(userInfo));
    this.socketService.on('core:leave', (userInfo: ClientInfo) => this.onLeave(userInfo));
    this.socketService.on('core:gameInfo', (game: GameInfo) => this.onGameInfo(game));
    this.socketService.on('core:createGame', (game: GameInfo) => this.onCreateGame(game));
    this.socketService.on('core:deleteGame', (gameId: number) => this.onDeleteGame(gameId));
  }

  private autoJoinGame(game: GameInfo) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === game.gameId && g.deleted === false);
    if (index !== -1) { // already joined
      return;
    }
    const clientId = this.sessionService.session.clientId;
    if (game.players.some(p => p.clientId === clientId)) {
      // we are listed as players, but not connected.
      this.gameService.join(game.gameId).subscribe(() => {}, () => {});
    }
  }

  private onJoin(userInfo: ClientInfo): void {
    const clients = [...this.sessionService.session.clients, userInfo];
    this.sessionService.set({ clients });
  }

  private onLeave(userInfo: ClientInfo): void {
    const clients = this.sessionService.session.clients.filter(user => user.clientId !== userInfo.clientId);
    this.sessionService.set({ clients });
  }

  private onGameInfo(game: GameInfo): void {
    const games = this.sessionService.session.games.slice();
    const index = this.sessionService.session.games.findIndex(g => g.gameId === game.gameId);
    if (index === -1) {
      return this.onCreateGame(game);
    }
    games[index] = game;
    this.sessionService.set({ games });
    this.autoJoinGame(game);
  }

  private onCreateGame(game: GameInfo): void {
    const index = this.sessionService.session.games.findIndex(g => g.gameId === game.gameId);
    if (index !== -1) {
      return;
    }
    const games = [...this.sessionService.session.games, game];
    this.sessionService.set({ games });
    this.autoJoinGame(game);
  }

  private onDeleteGame(gameId: number): void {
    const games = this.sessionService.session.games.filter(g => g.gameId !== gameId);
    this.gameService.markAsDeleted(gameId);
    this.sessionService.set({ games });
  }

  public getCoreInfo(): Observable<CoreInfo> {
    this.loading = true;
    return this.socketService.emit<void, CoreInfo>('core:getInfo')
      .pipe(finalize(() => { this.loading = false; }));
  }

  public createGame(deck: string[], gameSettings: GameSettings, clientId?: number) {
    this.loading = true;
    return this.socketService.emit('core:createGame', { deck, gameSettings, clientId })
      .pipe(finalize(() => { this.loading = false; }));
  }

}
