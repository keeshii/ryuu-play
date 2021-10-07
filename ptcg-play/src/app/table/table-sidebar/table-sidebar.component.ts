import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { Player, State, ReplayPlayer, PlayerStats } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LocalGameState } from '../../shared/session/session.interface';
import { GameService } from '../../api/services/game.service';
import { SessionService } from 'src/app/shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-table-sidebar',
  templateUrl: './table-sidebar.component.html',
  styleUrls: ['./table-sidebar.component.scss']
})
export class TableSidebarComponent implements OnInit, OnDestroy, OnChanges {

  @Output() join = new EventEmitter<void>();

  @Input() clientId: number;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;
  @Input() gameState: LocalGameState;

  public bottomReplayPlayer: ReplayPlayer | undefined;
  public topReplayPlayer: ReplayPlayer | undefined;
  public bottomPlayerStats: PlayerStats | undefined;
  public topPlayerStats: PlayerStats | undefined;
  public turn: number;
  public gameId: number;
  public isTopPlayerActive: boolean;
  public isBottomPlayerActive: boolean;

  private timerId: number | undefined;

  constructor(
    private gameService: GameService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private isPlayerActive(state: State, player: Player): boolean {
    if (!state || !player || !state.players[state.activePlayer]) {
      return false;
    }
    return player.id === state.players[state.activePlayer].id;
  }

  private isFirstPlayer(state: State, player: Player): boolean {
    if (!state || !player || state.players.length === 0) {
      return false;
    }
    return player.id === state.players[0].id;
  }

  private getPlayerStats(gameState: LocalGameState, player: Player): PlayerStats | undefined {
    if (!player || !gameState.playerStats) {
      return undefined;
    }
    return gameState.playerStats.find(p => p.clientId === player.id);
  }

  private refreshPlayerStats(gameState: LocalGameState) {
    this.gameService.getPlayerStats(gameState.gameId).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: response => {
        const gameStates = this.sessionService.session.gameStates.slice();
        const index = gameStates.findIndex(g => g.localId === gameState.localId);
        if (index !== -1) {
          gameStates[index] = { ...gameStates[index], playerStats: response.playerStats };
          this.sessionService.set({ gameStates });
        }
      }
    });
  }

  private startTimer() {
    if (this.timerId !== undefined) {
      return;
    }
    this.timerId = window.setInterval(() => {
      if (this.topPlayerStats
        && this.topPlayerStats.isTimeRunning
        && this.topPlayerStats.timeLeft > 0) {
        const timeLeft = this.topPlayerStats.timeLeft - 1;
        this.topPlayerStats = { ...this.topPlayerStats, timeLeft };
      }
      if (this.bottomPlayerStats
        && this.bottomPlayerStats.isTimeRunning
        && this.bottomPlayerStats.timeLeft > 0) {
        const timeLeft = this.bottomPlayerStats.timeLeft - 1;
        this.bottomPlayerStats = { ...this.bottomPlayerStats, timeLeft };
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId !== undefined) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  ngOnChanges() {
    if (!this.gameState) {
      this.turn = 0;
      this.gameId = undefined;
      this.isTopPlayerActive = false;
      this.isBottomPlayerActive = false;
      this.bottomReplayPlayer = undefined;
      this.topReplayPlayer = undefined;
      this.bottomPlayerStats = undefined;
      this.topPlayerStats = undefined;
      return;
    }

    const state = this.gameState.state;

    const topPlayerId = this.topPlayer && this.topPlayer.id;
    const bottomPlayerId = this.bottomPlayer && this.bottomPlayer.id;
    const gameOrPlayerHasChanged = this.gameId !== this.gameState.localId
      || (this.topPlayerStats && this.topPlayerStats.clientId !== topPlayerId)
      || (this.bottomPlayerStats && this.bottomPlayerStats.clientId !== bottomPlayerId);

    if (!this.gameState.deleted && gameOrPlayerHasChanged) {
      this.refreshPlayerStats(this.gameState);
    }

    this.gameId = this.gameState.localId;
    this.turn = state.turn;
    this.isTopPlayerActive = this.isPlayerActive(state, this.topPlayer);
    this.isBottomPlayerActive = this.isPlayerActive(state, this.bottomPlayer);
    this.topPlayerStats = this.getPlayerStats(this.gameState, this.topPlayer);
    this.bottomPlayerStats = this.getPlayerStats(this.gameState, this.bottomPlayer);
    this.bottomReplayPlayer = undefined;
    this.topReplayPlayer = undefined;

    if (this.gameState.deleted) {
      this.stopTimer();
    } else if (this.gameState.timeLimit > 0) {
      this.startTimer();
    }

    if (this.gameState.replay !== undefined) {
      this.bottomReplayPlayer = this.isFirstPlayer(state, this.bottomPlayer)
        ? this.gameState.replay.player1
        : this.gameState.replay.player2;

      this.topReplayPlayer = this.isFirstPlayer(state, this.topPlayer)
        ? this.gameState.replay.player1
        : this.gameState.replay.player2;
    }

  }

}
