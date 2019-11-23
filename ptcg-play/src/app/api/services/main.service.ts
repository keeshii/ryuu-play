import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { GameInfo, CoreInfo, UserInfo, GameState } from 'ptcg-server';
import { GameService } from './game.service';
import { SocketService } from '../socket.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MainService {

  public games$: Observable<GameInfo[]>;
  public users$: Observable<UserInfo[]>;
  public loading = false;

  private games = new BehaviorSubject<GameInfo[]>([]);
  private users = new BehaviorSubject<UserInfo[]>([]);

  constructor(
    private gameService: GameService,
    private socketService: SocketService
  ) {
    this.users$ = this.users.asObservable();
    this.games$ = this.games.asObservable();
  }

  public init(): void {
    this.socketService.on('connect', () => this.refresh());
    this.socketService.on('lobby:join', (userInfo: UserInfo) => this.onJoin(userInfo));
    this.socketService.on('lobby:leave', (userInfo: UserInfo) => this.onLeave(userInfo));
    this.socketService.on('lobby:createGame', (game: GameInfo) => this.onCreateGame(game));
    this.socketService.on('lobby:deleteGame', (gameId: number) => this.onDeleteGame(gameId));
  }

  private onJoin(userInfo: UserInfo): void {
    const users = [...this.users.value, userInfo];
    this.users.next(users);
  }

  private onLeave(userInfo: UserInfo): void {
    const users = this.users.value.filter(user => user.clientId !== userInfo.clientId);
    this.users.next(users);
  }

  private onCreateGame(game: GameInfo): void {
    const games = [...this.games.value, game];
    this.games.next(games);
  }

  private onDeleteGame(gameId: number): void {
    const games = this.games.value.filter(g => g.gameId !== gameId);
    this.games.next(games);
  }

  public async refresh() {
    this.loading = true;
    this.socketService.emit('lobby:getInfo')
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((data: CoreInfo) => {
        this.users.next(data.users);
        this.games.next(data.games);
      }, () => {});
  }

  public createGame() {
    this.loading = true;
    this.socketService.emit('lobby:createGame')
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((gameState: GameState) => {
        this.gameService.appendGameSate(gameState);
      }, () => {});
  }

  public joinGame() { }

  public leaveGame() { }

}
