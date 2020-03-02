import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameState, Player } from 'ptcg-server';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { GameService } from '../api/services/game.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public gameState: GameState;
  public gameStates$: Observable<GameState[]>;
  public clientId$: Observable<number>;
  public bottomPlayer: Player;
  public topPlayer: Player;
  public clientId: number;
  private gameId: number;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
    this.clientId$ = this.sessionService.get(session => session.clientId);
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        withLatestFrom(this.gameStates$, this.clientId$),
        takeUntilDestroyed(this)
      )
      .subscribe(([paramMap, gameStates, clientId]) => {
        this.gameId = parseInt(paramMap.get('gameId'), 10);
        this.gameState = gameStates.find(state => state.gameId === this.gameId);
        this.updatePlayers(this.gameState, clientId);
      });

    this.gameStates$
      .pipe(
        takeUntilDestroyed(this),
        withLatestFrom(this.clientId$)
      )
      .subscribe(([gameStates, clientId]) => {
        this.gameState = gameStates.find(state => state.gameId === this.gameId);
        this.updatePlayers(this.gameState, clientId);
      });
  }

  ngOnDestroy() { }

  public async play() {
    const selected = await this.alertService.select({
      title: 'Choose your deck',
      placeholder: 'Your deck',
      options: [{value: 'deck1', viewValue: 'Deck 1'}],
      value: 'deck1'
    });
    if (selected !== undefined) {
      const deck: string[] = this.createSampleDeck();
      this.gameService.play(this.gameId, deck);
    }
  }

  private updatePlayers(gameState: GameState, clientId: number) {
    this.bottomPlayer = undefined;
    this.topPlayer = undefined;
    this.clientId = clientId;

    if (!gameState || !gameState.state) {
      return;
    }

    const state = gameState.state;
    if (state.players.length >= 1) {
      if (state.players[0].id === clientId) {
        this.bottomPlayer = state.players[0];
      } else {
        this.topPlayer = state.players[0];
      }
    }

    if (state.players.length >= 2) {
      if (this.bottomPlayer === state.players[0]) {
        this.topPlayer = state.players[1];
      } else {
        this.bottomPlayer = state.players[1];
      }
    }
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
