import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameState } from 'ptcg-server';
import { withLatestFrom } from 'rxjs/operators';

import { GameService } from '../api/services/game.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public table: GameState;

  private gameId: number;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(withLatestFrom(this.gameService.gameStates$))
      .pipe(takeUntilDestroyed(this))
      .subscribe(([paramMap, gameStates]) => {
        this.gameId = parseInt(paramMap.get('gameId'), 10);
        this.table = gameStates.find(state => state.gameId === this.gameId);
      });

    this.gameService.gameStates$
      .pipe(takeUntilDestroyed(this))
      .subscribe(gameStates => {
        this.table = gameStates.find(state => state.gameId === this.gameId);
      });
  }

  ngOnDestroy() { }

  public play() { }

}
