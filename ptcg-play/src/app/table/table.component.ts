import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameState } from 'ptcg-server';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { GameService } from '../api/services/game.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public table: GameState;
  public gameStates$: Observable<GameState[]>;
  private gameId: number;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(withLatestFrom(this.gameStates$))
      .pipe(takeUntilDestroyed(this))
      .subscribe(([paramMap, gameStates]) => {
        this.gameId = parseInt(paramMap.get('gameId'), 10);
        this.table = gameStates.find(state => state.gameId === this.gameId);
      });

    this.gameStates$
      .pipe(takeUntilDestroyed(this))
      .subscribe(gameStates => {
        this.table = gameStates.find(state => state.gameId === this.gameId);
      });
  }

  ngOnDestroy() { }

  public play() {
    const deck: string[] = this.createSampleDeck();
    this.gameService.play(this.gameId, deck);
  }

  private createSampleDeck(): string[] {
    const deck: string[] = [];
    for (let i = 0; i < 56; i++) {
      deck.push('Water Energy EVO');
    }
    for (let i = 0; i < 4; i++) {
      deck.push('Buizel GE');
    }
    return deck;
  }

}
