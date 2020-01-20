import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { GameInfo, GameState } from 'ptcg-server';
import { Observable } from 'rxjs';

import { GameService } from 'src/app/api/services/game.service';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from 'src/app/shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-game-actions',
  templateUrl: './game-actions.component.html',
  styleUrls: ['./game-actions.component.scss']
})
export class GameActionsComponent implements OnInit, OnDestroy {

  @Input() game: GameInfo;
  public gameStates$: Observable<GameState[]>;
  public isJoined: boolean;

  constructor(
    private gameService: GameService,
    private sessionService: SessionService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
  }

  ngOnInit() {
    this.sessionService.get(session => session.gameStates)
      .pipe(takeUntilDestroyed(this))
      .subscribe(gameStates => {
        this.isJoined = this.hasGameState(gameStates);
      });
  }

  private hasGameState(gameStates: GameState[]): boolean {
    if (!this.game) {
      return false;
    }
    const gameId = this.game.gameId;
    const index = gameStates.findIndex(g => g.gameId === gameId);
    return index !== -1;
  }

  ngOnDestroy() { }

  public join() {
    this.gameService.join(this.game.gameId)
      .subscribe(() => {}, () => {});
  }

  public leave() {
    this.gameService.leave(this.game.gameId);
  }

}
