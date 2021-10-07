import { Component, Input } from '@angular/core';
import { GamePhase } from 'ptcg-server';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../shared/alert/alert.service';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent {

  @Input() set gameState(gameState: LocalGameState) {
    const clientId = this.sessionService.session.clientId;
    this.isDeleted = gameState.deleted;
    this.gameId = gameState.gameId;
    this.localId = gameState.localId;
    this.label = this.buildLabel(gameState);
    this.isPlaying = this.checkPlaying(gameState, clientId);
    this.updateBadge(gameState, clientId);
  }

  public isPlaying = false;
  public isDeleted = false;
  public label: string;
  public badgeContent: string;
  public badgeColor: string;
  public localId: number;
  private gameId: number;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) { }

  private checkPlaying(gameState: LocalGameState, clientId: number): boolean {
    if (gameState.replay || gameState.deleted) {
      return false;
    }
    return gameState.state.players.some(p => p.id === clientId);
  }

  private updateBadge(gameState: LocalGameState, clientId: number): void {
    let badgeContent = '';
    let badgeColor = 'primary';

    if (this.isPlaying && !gameState.deleted) {
      const state = gameState.state;
      const prompts = state.prompts.filter(p => p.result === undefined);
      const waitingForMe = prompts.some(p => p.playerId === clientId);
      const myTurn = state.players[state.activePlayer].id === clientId && state.phase === GamePhase.PLAYER_TURN;
      const waitingForInvitation = prompts.find(p => p.type === 'Invite player');

      if (waitingForMe && waitingForInvitation) {
        badgeContent = '?';
        badgeColor = 'accent';
      } else if (waitingForMe || myTurn) {
        badgeContent = '!';
        badgeColor = 'primary';
      } else {
        badgeContent = '';
      }
    }
    if (this.badgeContent !== badgeContent || this.badgeColor !== badgeColor) {
      this.badgeContent = badgeContent;
      this.badgeColor = badgeColor;
    }
  }

  private buildLabel(gameState: LocalGameState): string {
    const loggedUserId = this.sessionService.session.loggedUserId;
    const loggedUser = this.sessionService.session.users[loggedUserId];
    if (loggedUser === undefined) {
      return this.translate.instant('MAIN_TABLE_UNKNOWN', { id: gameState.localId });
    }
    const clientId = this.sessionService.session.clientId;
    const opponent = gameState.state.players.find(p => p.id !== clientId);
    let name = loggedUser.name;
    if (opponent !== undefined) {
      name = opponent.name;
    }
    return this.translate.instant('MAIN_TABLE_NAME', {
      id: gameState.localId,
      name
    });
  }

  async onClose() {
    if (this.isPlaying) {
      const result = await this.alertService.confirm(
        this.translate.instant('MAIN_LEAVE_GAME')
      );

      if (!result) {
        return;
      }
    }

    if (this.isDeleted) {
      this.gameService.removeLocalGameState(this.localId);
    } else {
      this.gameService.leave(this.gameId);
    }
  }

}
