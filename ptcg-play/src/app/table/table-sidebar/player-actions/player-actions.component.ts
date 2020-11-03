import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../../shared/alert/alert.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';

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
    private gameService: GameService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  public async leave() {
    if (!this.gameState || !this.gameState.gameId) {
      return;
    }
    const result = await this.alertService.confirm(
      this.translate.instant('MAIN_LEAVE_GAME')
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

  public switchSides() {
    if (!this.gameState) {
      return;
    }
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.localId === this.gameState.localId);
    if (index === -1) {
      return;
    }
    const gameStates = this.sessionService.session.gameStates.slice();
    const switchSide = !this.gameState.switchSide;
    gameStates[index] = {...gameStates[index], switchSide };
    this.sessionService.set({ gameStates });
  }

}
