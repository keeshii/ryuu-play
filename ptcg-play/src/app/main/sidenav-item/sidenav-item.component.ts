import { Component, OnInit, Input } from '@angular/core';
import { GamePhase } from 'ptcg-server';

import { AlertService } from '../../shared/alert/alert.service';
import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent implements OnInit {

  @Input() set gameState(gameState: LocalGameState) {
    this.isDeleted = gameState.deleted;
    this.gameId = gameState.gameId;
    this.localId = gameState.localId;
    this.label = this.buildLabel(gameState);
    this.updateBadge(gameState);
  }

  public isDeleted = false;
  public label: string;
  public badgeContent: string;
  public badgeColor: string;
  public localId: number;
  private gameId: number;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
  }

  private updateBadge(gameState: LocalGameState): void {
    const clientId = this.sessionService.session.clientId;
    const state = gameState.state;
    const prompts = state.prompts.filter(p => p.result === undefined);
    const waitingForMe = prompts.some(p => p.playerId === clientId);
    const myTurn = state.players[state.activePlayer].id === clientId && state.phase === GamePhase.PLAYER_TURN;
    const waitingForInvitation = prompts.find(p => p.type === 'Invite player');

    if (waitingForMe && waitingForInvitation) {
      this.badgeContent = '?';
      this.badgeColor = 'accent';
    } else if (waitingForMe || myTurn) {
      this.badgeContent = '!';
      this.badgeColor = 'primary';
    } else {
      this.badgeContent = '';
    }
  }

  private buildLabel(gameState: LocalGameState): string {
    const loggedUserId = this.sessionService.session.loggedUserId;
    const loggedUser = this.sessionService.session.users[loggedUserId];
    if (loggedUser === undefined) {
      return `#${gameState.localId} Unknown`;
    }
    const clientId = this.sessionService.session.clientId;
    const opponent = gameState.state.players.find(p => p.id !== clientId);
    let name = loggedUser.name;
    if (opponent !== undefined) {
      name = opponent.name;
    }
    return `#${gameState.localId} ${name}`;
  }

  async onClose() {
    const result = await this.alertService.confirm(
      'Do you really want to leave the game?'
    );

    if (!result) {
      return;
    }

    if (this.isDeleted) {
      this.gameService.removeLocalGameState(this.localId);
    } else {
      this.gameService.leave(this.gameId);
    }
  }

}
