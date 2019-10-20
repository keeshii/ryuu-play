import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { GameInfo, LobbyInfo, UserInfo } from 'ptcg-server';
import { Game } from 'src/app/shared/session/game.interface';
import { SocketService } from '../socket.service';
import { User } from 'src/app/shared/session/user.interface';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MainService {

  public games$: Observable<GameInfo[]>;
  public users$: Observable<UserInfo[]>;
  public loading = false;

  private games = new BehaviorSubject<GameInfo[]>([]);
  private users = new BehaviorSubject<UserInfo[]>([]);

  constructor(private socketService: SocketService) {
    this.users$ = this.users.asObservable();
    this.games$ = this.games.asObservable();
  }

  public init(): void {
    this.socketService.on('connect', () => this.refresh());
    this.socketService.on('lobby:createGame', (game: GameInfo) => this.onCreateGame(game));
    this.socketService.on('main:gameDelete', (gameId: number) => this.onDeleteGame(gameId));
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
      .subscribe((data: LobbyInfo) => {
        this.users.next(data.users);
        this.games.next(data.games);
      }, () => {});
  }

  public createGame() {
    this.loading = true;
    this.socketService.emit('lobby:createGame')
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((gameInfo: GameInfo) => {
        const games = [...this.games.value, gameInfo];
        this.games.next(games);
      }, () => {});
  }

  public joinGame() { }

  public leaveGame() { }

}
