import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player, GamePhase } from 'ptcg-server';
import { Observable, from, EMPTY } from 'rxjs';
import { withLatestFrom, switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../api/api.error';
import { AlertService } from '../shared/alert/alert.service';
import { DeckService } from '../api/services/deck.service';
import { GameService } from '../api/services/game.service';
import { LocalGameState } from '../shared/session/session.interface';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public gameState: LocalGameState;
  public gameStates$: Observable<LocalGameState[]>;
  public clientId$: Observable<number>;
  public bottomPlayer: Player;
  public topPlayer: Player;
  public clientId: number;
  public loading: boolean;
  public waiting: boolean;
  private gameId: number;

  constructor(
    private alertService: AlertService,
    private gameService: GameService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
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
        this.gameState = gameStates.find(state => state.localId === this.gameId);
        this.updatePlayers(this.gameState, clientId);
      });

    this.gameStates$
      .pipe(
        takeUntilDestroyed(this),
        withLatestFrom(this.clientId$)
      )
      .subscribe(([gameStates, clientId]) => {
        this.gameState = gameStates.find(state => state.localId === this.gameId);
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

  private updatePlayers(gameState: LocalGameState, clientId: number) {
    this.bottomPlayer = undefined;
    this.topPlayer = undefined;
    this.waiting = false;
    this.clientId = clientId;

    if (!gameState || !gameState.state) {
      this.router.navigate(['/games']);
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

      if (gameState.switchSide) {
        const tmp = this.topPlayer;
        this.topPlayer = this.bottomPlayer;
        this.bottomPlayer = tmp;
      }

      if (gameState.replay !== undefined) {
        this.clientId = this.bottomPlayer.id;
      }

      const prompts = state.prompts.filter(p => p.result === undefined);
      const waitingForOthers = prompts.some(p => p.playerId !== clientId);
      const waitingForMe = prompts.some(p => p.playerId === clientId);
      const notMyTurn = state.players[state.activePlayer].id !== clientId
        && state.phase === GamePhase.PLAYER_TURN;
      this.waiting = (notMyTurn || waitingForOthers) && !waitingForMe;
    }
  }

}
