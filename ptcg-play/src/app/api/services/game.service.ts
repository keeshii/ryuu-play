import { Injectable } from '@angular/core';
import { Action, UserInfo, GameState } from 'ptcg-server';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SocketService } from '../socket.service';

export interface GameUserInfo {
  gameId: number;
  userInfo: UserInfo;
}

@Injectable()
export class GameService {

  public gameStates$: Observable<GameState[]>;
  private gameStates = new BehaviorSubject<GameState[]>([]);

  constructor(private socketService: SocketService) {
    this.gameStates$ = this.gameStates.asObservable();
  }

  public join(gameId: number): Observable<GameState> {
    return new Observable<GameState>(observer => {
      this.socketService.emit('game:join', gameId)
        .pipe(finalize(() => observer.complete()))
        .subscribe((gameState: GameState) => {
          this.appendGameSate(gameState);
          observer.next(gameState);
        }, (error: any) => {
          observer.error(error);
        });
    });
  }

  public appendGameSate(gameState: GameState) {
    const gameId = gameState.gameId;
    const index = this.gameStates.value.findIndex(g => g.gameId === gameId);
    if (index === -1) {
      const gameStates = [...this.gameStates.value, gameState];
      this.gameStates.next(gameStates);
    }
  }

  public leave(gameId: number) {
    this.socketService.emit('game:leave', gameId)
      .subscribe(() => {
        const tables = this.gameStates.value.filter(table => table.gameId !== gameId);
        this.gameStates.next(tables);
      });
  }

  public play(deck: string[]) { }

  public dispatch(action: Action) { }

}
