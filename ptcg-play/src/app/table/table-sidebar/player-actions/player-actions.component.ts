import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GameState } from 'ptcg-server';

import { AlertService } from '../../../shared/alert/alert.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-player-actions',
  templateUrl: './player-actions.component.html',
  styleUrls: ['./player-actions.component.scss']
})
export class PlayerActionsComponent implements OnInit {

  @Input() gameState: LocalGameState;
  @Input() clientId: number;

  @Output() join = new EventEmitter<void>();

  constructor(
    private alertService: AlertService,
    private gameService: GameService
  ) { }

  ngOnInit() {
  }

  public async leave() {
    if (!this.gameState || !this.gameState.gameId) {
      return;
    }
    const result = await this.alertService.confirm(
      'Do you really want to leave the game?'
    );

    if (!result) {
      return;
    }

    if (this.gameState.deleted) {
      this.gameService.removeLocalGameState(this.gameState.localId);
    } else {
      this.gameService.leave(this.gameState.gameId);
    }
  }

  public passTurn() {
    if (!this.gameState || !this.gameState.gameId) {
      return;
    }
    this.gameService.passTurnAction(this.gameState.gameId);
  }

}
