import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Player, UserInfo, ReplayPlayer, PlayerStats, State, GamePhase } from '@ptcg/common';
import { Observable, EMPTY } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ChooseAvatarPopupService } from '../choose-avatar-popup/choose-avatar-popup.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState, Session } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';
import { UserInfoPopupService } from '../../../shared/user-info/user-info-popup/user-info-popup.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnChanges {

  @Input() clientId: number;
  @Input() gameState: LocalGameState;
  @Input() player: Player;
  @Input() replayPlayer: ReplayPlayer;
  @Input() active: boolean;
  @Input() playerStats: PlayerStats | undefined;

  public isTimeRunning: boolean;
  public timeLimit: number;
  public isEmpty = true;
  public deckCount: number;
  public handCount: number;
  public discardCount: number;
  public name: string;
  public allowAvatarClick: boolean;
  public avatarName: string;
  public userInfo$: Observable<UserInfo | undefined> = EMPTY;

  constructor(
    private chooseAvatarPopupService: ChooseAvatarPopupService,
    private gameService: GameService,
    private sessionService: SessionService,
    private userInfoPopupService: UserInfoPopupService
  ) { }

  public onAvatarClick() {
    // Find user of the current player
    const session = this.sessionService.session;
    const user = this.getUserInfo(session, this.player, this.replayPlayer);
    if (user === undefined) {
      return;
    }

    const gameId = this.gameState.gameId;
    const userId = user.userId;
    const selected = this.avatarName;

    const dialogRef = this.chooseAvatarPopupService.openDialog(userId, selected);
    dialogRef.afterClosed().pipe(
      untilDestroyed(this)
    ).subscribe({
      next: avatarName => {
        if (avatarName !== undefined) {
          this.gameService.changeAvatarAction(gameId, avatarName);
        }
      }
    });
  }

  public onUserNameClick() {
    // Find user of the current player
    const session = this.sessionService.session;
    const user = this.getUserInfo(session, this.player, this.replayPlayer);
    if (user === undefined) {
      return;
    }
    this.userInfoPopupService.showUserInfo(user);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const changedKeys = Object.keys(changes);

    // Input changes does not require reinitialization
    if (!changedKeys.includes('clientId')
      && !changedKeys.includes('gameState')
      && !changedKeys.includes('player')
      && !changedKeys.includes('replayPlayer')) {
      return;
    }

    // Not fully initialized
    if (!this.clientId || !this.gameState || !this.player) {
      this.isEmpty = true;
      this.avatarName = undefined;
      this.allowAvatarClick = false;
      return;
    }

    const player = this.player;
    const replayPlayer = this.replayPlayer;

    this.isEmpty = !player;
    if (this.isEmpty) {
      return;
    }

    this.deckCount = player.deck.cards.length;
    this.handCount = player.hand.cards.length;
    this.discardCount = player.discard.cards.length;
    this.timeLimit = this.gameState.timeLimit;
    this.name = player.name;
    this.avatarName = player.avatarName;

    // User is allowed to change avatar, if game is not finished
    this.allowAvatarClick = this.clientId === player.id && !this.gameState.deleted;

    this.userInfo$ = this.sessionService.get(session => {
      return this.getUserInfo(session, player, replayPlayer);
    });
  }

  private getUserInfo(session: Session, player: Player, replayPlayer: ReplayPlayer): UserInfo | undefined {
    if (replayPlayer) {
      return session.users[replayPlayer.userId];
    }
    const client = session.clients.find(c => c.clientId === player.id);
    return client !== undefined ? session.users[client.userId] : undefined;
  }

}
