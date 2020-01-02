import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { GameInfo, GameState } from 'ptcg-server';

import { GameService } from '../../api/services/game.service';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public gameJson: string;
  public isJoined: boolean;

  @Input()
  set game(value: GameInfo) {
    this.gameValue = value;
    this.gameJson = JSON.stringify(value);
  }

  get game() {
    return this.gameValue;
  }

  private gameValue: GameInfo;

  constructor(
    private gameService: GameService,
    private sessionService: SessionService
  ) { }

  public join() {
    this.gameService.join(this.game.gameId)
      .subscribe(() => {}, () => {});
  }

  public leave() {
    this.gameService.leave(this.game.gameId);
  }

  ngOnInit() {
    this.sessionService.get(session => session.gameStates)
      .pipe(takeUntilDestroyed(this))
      .subscribe(gameStates => {
        this.isJoined = this.hasGameState(gameStates);
      });
  }

  private hasGameState(gameStates: GameState[]): boolean {
    const gameId = this.game.gameId;
    const index = gameStates.findIndex(g => g.gameId === gameId);
    return index !== -1;
  }

  ngOnDestroy() { }

}
