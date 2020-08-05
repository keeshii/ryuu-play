import { Injectable } from '@angular/core';
import { GameInfo, CoreInfo, ClientInfo, GameState, GameSettings } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GameService } from './game.service';
import { SessionService } from '../../shared/session/session.service';
import { SocketService } from '../socket.service';

@Injectable()
export class MainService {

  public loading = false;

  constructor(
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
  }

  private onCreateGame(game: GameInfo): void {
    const index = this.sessionService.session.games.findIndex(g => g.gameId === game.gameId);
    if (index !== -1) {
      return;
    }
    const games = [...this.sessionService.session.games, game];
    this.sessionService.set({ games });
  }

  private onDeleteGame(gameId: number): void {
    const games = this.sessionService.session.games.filter(g => g.gameId !== gameId);
    this.gameService.removeGameState(gameId);
    this.sessionService.set({ games });
  }

  public getCoreInfo(): Observable<CoreInfo> {
    this.loading = true;
    return this.socketService.emit<void, CoreInfo>('core:getInfo')
      .pipe(finalize(() => { this.loading = false; }));
  }

  public createGame(deck: string[], gameSettings: GameSettings) {
    this.loading = true;
    this.socketService.emit('core:createGame', { deck, gameSettings })
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((gameState: GameState) => {
        this.gameService.appendGameState(gameState);
      }, () => {});
  }

}
