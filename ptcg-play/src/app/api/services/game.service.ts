import { Injectable } from '@angular/core';
import { ClientInfo, GameState, State, CardTarget, StateLog, Replay,
  Base64, StateSerializer } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../api.error';
import { LocalGameState } from '../../shared/session/session.interface';
import { SocketService } from '../socket.service';
import { SessionService } from '../../shared/session/session.service';

export interface GameUserInfo {
  gameId: number;
  userInfo: ClientInfo;
}

@Injectable()
export class GameService {

  constructor(
    private alertService: AlertService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) { }

  public join(gameId: number): Observable<GameState> {
    return new Observable<GameState>(observer => {
      this.socketService.emit('game:join', gameId)
        .pipe(finalize(() => observer.complete()))
        .subscribe((gameState: GameState) => {
          this.appendGameState(gameState);
          observer.next(gameState);
        }, (error: any) => {
          observer.error(error);
        });
    });
  }

  public appendGameState(gameState: GameState, replay?: Replay): LocalGameState | undefined {
    const gameId = gameState.gameId;
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      const logs: StateLog[] = [];
      let lastGameId = this.sessionService.session.lastGameId || 0;
      lastGameId++;
      const localGameState: LocalGameState = {
        ...gameState,
        localId: lastGameId,
        gameOver: replay ? true : false,
        deleted: replay ? true : false,
        state: this.decodeStateData(gameState.stateData),
        logs,
        replayPosition: 1,
        replay
      };
      const gameStates = [...games, localGameState ];
      this.startListening(gameState.gameId);
      this.sessionService.set({ gameStates, lastGameId });
      return localGameState;
    }
  }

  public markAsDeleted(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], deleted: true };
      this.stopListening(gameId);
      this.sessionService.set({ gameStates });
    }
  }

  public removeGameState(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = games.filter(g => g.gameId !== gameId || g.deleted !== false);
      this.stopListening(gameId);
      this.sessionService.set({ gameStates });
    }
  }

  public removeLocalGameState(localGameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.localId === localGameId);
    if (index !== -1) {
      const gameStates = games.filter(table => table.localId !== localGameId);
      this.sessionService.set({ gameStates });
    }
  }

  public leave(gameId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const localGameId = games[index].localId;
      this.socketService.emit('game:leave', gameId)
        .subscribe(() => {
          this.removeGameState(gameId);
          this.removeLocalGameState(localGameId);
        }, (error: ApiError) => this.alertService.toast(error.message));
    }
  }

  public ability(gameId: number, ability: string, target: CardTarget) {
    this.socketService.emit('game:action:ability', { gameId, ability, target })
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public attack(gameId: number, attack: string) {
    this.socketService.emit('game:action:attack', { gameId, attack })
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public play(gameId: number, deck: string[]) {
    this.socketService.emit('game:action:play', { gameId, deck })
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public resolvePrompt(gameId: number, promptId: number, result: any) {
    this.socketService.emit('game:action:resolvePrompt', {gameId, id: promptId, result})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public playCardAction(gameId: number, handIndex: number, target: CardTarget) {
    this.socketService.emit('game:action:playCard', {gameId, handIndex, target})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public reorderBenchAction(gameId: number, from: number, to: number) {
    this.socketService.emit('game:action:reorderBench', {gameId, from, to})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public reorderHandAction(gameId: number, order: number[]) {
    this.socketService.emit('game:action:reorderHand', {gameId, order})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public retreatAction(gameId: number, to: number) {
    this.socketService.emit('game:action:retreat', {gameId, to})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public passTurnAction(gameId: number) {
    this.socketService.emit('game:action:passTurn', {gameId})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public appendLogAction(gameId: number, message: string) {
    this.socketService.emit('game:action:appendLog', {gameId, message})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  public changeAvatarAction(gameId: number, avatarName: string) {
    this.socketService.emit('game:action:changeAvatar', {gameId, avatarName})
      .subscribe(() => {}, (error: ApiError) => this.alertService.toast(error.message));
  }

  private startListening(id: number) {
    this.socketService.on(`game[${id}]:join`, (clientId: number) => this.onJoin(id, clientId));
    this.socketService.on(`game[${id}]:leave`, (clientId: number) => this.onLeave(id, clientId));
    this.socketService.on(`game[${id}]:stateChange`, (stateData: string) => this.onStateChange(id, stateData));
  }

  private stopListening(id: number) {
    this.socketService.off(`game[${id}]:join`);
    this.socketService.off(`game[${id}]:leave`);
    this.socketService.off(`game[${id}]:stateChange`);
  }

  private onStateChange(gameId: number, stateData: string) {
    const state = this.decodeStateData(stateData);
    console.log('gameService, onStateChange', gameId, state);
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      const logs = [ ...gameStates[index].logs, ...state.logs ];
      gameStates[index] = { ...gameStates[index], state, logs };
      this.sessionService.set({ gameStates });
    }
  }

  private onJoin(gameId: number, clientId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      return;
    }
    const game = this.sessionService.session.gameStates[index];
    const clientIndex = game.clientIds.indexOf(clientId);
    if (clientIndex === -1) {
      const clientIds = [ ...game.clientIds, clientId ];
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], clientIds };
      this.sessionService.set({ gameStates });
    }
  }

  private onLeave(gameId: number, clientId: number) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.gameId === gameId && g.deleted === false);
    if (index === -1) {
      return;
    }
    const game = this.sessionService.session.gameStates[index];
    const clientIndex = game.clientIds.indexOf(clientId);
    if (clientIndex !== -1) {
      const clientIds = game.clientIds.filter(id => id !== clientId);
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], clientIds };
      this.sessionService.set({ gameStates });
    }
  }

  private decodeStateData(stateData: string): State {
    const base64 = new Base64();
    const serializedState = base64.decode(stateData);
    const serializer = new StateSerializer();
    return serializer.deserialize(serializedState);
  }

}
