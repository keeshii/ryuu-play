import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameState, Player } from 'ptcg-server';
import { Observable, from, EMPTY } from 'rxjs';
import { withLatestFrom, switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../api/api.error';
import { AlertService } from '../shared/alert/alert.service';
import { DeckService } from '../api/services/deck.service';
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
  public loading: boolean;
  private gameId: number;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private deckService: DeckService,
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

  public play() {
    this.loading = true;
    this.deckService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this),
        switchMap(decks => {
          const options = decks.decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => ({value: deckEntry.id, viewValue: deckEntry.name}));

          if (options.length === 0) {
            this.alertService.alert(
              'You must prepare a valid deck before joining the game',
              'No valid decks'
            );
            return EMPTY;
          }

          return from(this.alertService.select({
            title: 'Choose your deck',
            placeholder: 'Your deck',
            options,
            value: options[0].value
          }));
        }),
        switchMap(deckId => {
          return deckId !== undefined
            ? this.deckService.getDeck(deckId)
            : EMPTY;
        })
      )
      .subscribe({
        next: deckResponse => {
          const deck = deckResponse.deck.cards;
          this.gameService.play(this.gameId, deck);
        },
        error: (error: ApiError) => {}
      });
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
