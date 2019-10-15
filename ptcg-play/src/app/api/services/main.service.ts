import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Game } from 'src/app/shared/session/game.interface';
import { SocketService } from '../socket.service';
import { User } from 'src/app/shared/session/user.interface';
import {finalize} from 'rxjs/operators';

interface MainRefreshData {
  users: User[]
  games: Game[]
}

@Injectable()
export class MainService {

  public users$: Observable<User[]>;
  public games$: Observable<Game[]>;
  public loading: boolean = false;
  private games = new BehaviorSubject<Game[]>([]);
  private users = new BehaviorSubject<User[]>([]);

  constructor(private socketService: SocketService) {}

  public init(): void {
    this.socketService.on('connect', () => this.refresh());
    this.socketService.on('main:gameAdd', (game: Game) => this.onGameAdd(game));
    this.socketService.on('main:gameDelete', (gameId: number) => this.onGameDelete(gameId));
    this.socketService.on('main:gameState', (game: Game) => this.onGameState(game));
    this.socketService.on('main:userConnect', (user: User) => this.onUserConnect(user));
    this.socketService.on('main:userDisconnect', (name: string) => this.onUserDisconnect(name));
  }

  private onGameAdd(game: Game): void {
    const games = [...this.games.value, game];
    this.games.next(games);
  }

  private onGameState(game: Game): void {
    const gameIndex = this.games.value.findIndex(g => g.id === game.id);
    if (gameIndex === -1) {
      return this.onGameAdd(game);
    }
    const games = this.games.value.slice().splice(gameIndex, 1, game);
    this.games.next(games);
  }

  private onGameDelete(gameId: number): void {
    const games = this.games.value.filter(g => g.id !== gameId);
    this.games.next(games);
  }

  private onUserConnect(user: User): void {
    const users = [...this.users.value, user];
    this.users.next(users);
  }

  private onUserDisconnect(name: string): void {
    const users = this.users.value.filter(u => u.name !== name);
    this.users.next(users);
  }

  public async refresh() {
    this.loading = true;
    this.socketService.emit('main:refresh')
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((data: MainRefreshData) => {
        this.users.next(data.users);
        this.games.next(data.games);
      }, () => {});
  }

  public createGame() { }

  public joinGame() { }

  public leaveGame() { }

}
