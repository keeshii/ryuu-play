import { Injectable } from '@angular/core';
import { Action, UserInfo, GameState, State } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SocketService } from '../socket.service';
import { SessionService } from 'src/app/shared/session/session.service';

export interface GameUserInfo {
  gameId: number;
  userInfo: UserInfo;
}

@Injectable()
export class GameService {

  constructor(
    private sessionService: SessionService,
    private socketService: SocketService
  ) { }

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
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId);
    if (index === -1) {
      const gameStates = [...games, gameState];
      this.startListening(gameState.gameId);
      this.sessionService.set({ gameStates });
    }
  }

  public leave(gameId: number) {
    this.socketService.emit('game:leave', gameId)
      .subscribe(() => {
        const games = this.sessionService.session.gameStates;
        const gameStates = games.filter(table => table.gameId !== gameId);
        this.stopListening(gameId);
        this.sessionService.set({ gameStates });
      });
  }

  public play(gameId: number, deck: string[]) {
    this.socketService.emit('game:action:play', { gameId, deck })
      .subscribe(() => {});
  }

  public dispatch(action: Action) { }

  private startListening(id: number) {
    console.log('startListening', id);
    this.socketService.on(`game[${id}]:join`, (userInfo: UserInfo) => this.onJoin(id, userInfo));
    this.socketService.on(`game[${id}]:leave`, (userInfo: UserInfo) => this.onLeave(id, userInfo));
    this.socketService.on(`game[${id}]:stateChange`, (state: State) => this.onStateChange(id, state));
  }

  private stopListening(id: number) {
    console.log('stopListening', id);
    this.socketService.off(`game[${id}]:join`);
    this.socketService.off(`game[${id}]:leave`);
  }

  private onStateChange(gameId: number, state: State) {
    console.log('gameService, onStateChange', gameId, state);
    const index = this.sessionService.session.gameStates.findIndex(g => g.gameId === gameId);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], state };
      this.sessionService.set({ gameStates });
    }
  }

  private onJoin(gameId: number, userInfo: UserInfo) {
    console.log('gameService, onJoin', gameId, userInfo);
  }

  private onLeave(gameId: number, userInfo: UserInfo) {
    console.log('gameService, onLeave', gameId, userInfo);
  }

}
