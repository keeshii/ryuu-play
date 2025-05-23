import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { GameInfo, GameState } from '@ptcg/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { GameService } from 'src/app/api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-game-actions',
  templateUrl: './game-actions.component.html',
  styleUrls: ['./game-actions.component.scss']
})
export class GameActionsComponent implements OnInit {

  @Input() game: GameInfo;
  public gameStates$: Observable<GameState[]>;
  public isJoined: boolean;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
  }

  ngOnInit() {
    this.sessionService.get(session => session.gameStates)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(gameStates => {
        this.isJoined = this.hasGameState(gameStates);
      });
  }

  private hasGameState(gameStates: LocalGameState[]): boolean {
    if (!this.game) {
      return false;
    }
    const gameId = this.game.gameId;
    const index = gameStates.findIndex(g => g.gameId === gameId && g.deleted === false);
    return index !== -1;
  }

  public join() {
    this.gameService.join(this.game.gameId)
      .subscribe(() => {}, () => {});
  }

  public async leave() {
    const result = await this.alertService.confirm(
      this.translate.instant('MAIN_LEAVE_GAME')
    );

    if (!result) {
      return;
    }

    this.gameService.leave(this.game.gameId);
  }

}
