import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { Player, State, ReplayPlayer } from 'ptcg-server';

import { ChooseAvatarPopupService } from './choose-avatar-popup/choose-avatar-popup.service';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

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
  public turn: number;
  public gameId: number;
  public isTopPlayerActive: boolean;
  public isBottomPlayerActive: boolean;

  constructor(
    private chooseAvatarPopupService: ChooseAvatarPopupService,
    private gameService: GameService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
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

  public onAvatarClick(player: Player) {
    // Game is finished, or we have clicked other client
    if (this.gameState.deleted || this.clientId !== player.id) {
      return;
    }

    const userId = this.sessionService.session.loggedUserId;
    const selected = player.avatarName;

    const dialogRef = this.chooseAvatarPopupService.openDialog(userId, selected);
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: avatarName => {
        if (avatarName !== undefined) {
          this.gameService.changeAvatarAction(this.gameId, avatarName);
        }
      }
    });
  }

  ngOnChanges() {
    if (!this.gameState) {
      this.turn = 0;
      this.gameId = undefined;
      this.isTopPlayerActive = false;
      this.isBottomPlayerActive = false;
      this.bottomReplayPlayer = undefined;
      this.topReplayPlayer = undefined;
      return;
    }

    const state = this.gameState.state;
    this.gameId = this.gameState.gameId;
    this.turn = state.turn;
    this.isTopPlayerActive = this.isPlayerActive(state, this.topPlayer);
    this.isBottomPlayerActive = this.isPlayerActive(state, this.bottomPlayer);

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
