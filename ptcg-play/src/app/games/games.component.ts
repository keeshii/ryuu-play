import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameInfo, ClientInfo } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { Observable, EMPTY, from } from 'rxjs';
import { finalize, switchMap, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { CreateGamePopupComponent, CreateGamePopupResult } from './create-game-popup/create-game-popup.component';
import { DeckService } from '../api/services/deck.service';
import { MainService } from '../api/services/main.service';
import { SelectPopupOption } from '../shared/alert/select-popup/select-popup.component';
import { SessionService } from '../shared/session/session.service';
import { SocketService } from '../api/socket.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnDestroy, OnInit {
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public users$: Observable<ClientInfo[]>;
  public games$: Observable<GameInfo[]>;
  public isConnected = false;
  public loading = false;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private dialog: MatDialog,
    private mainSevice: MainService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) {
    this.users$ = this.sessionService.get(session => session.clients);
    this.games$ = this.sessionService.get(session => session.games);
  }

  ngOnInit() {
    this.socketService.connection
      .pipe(takeUntilDestroyed(this))
      .subscribe(connected => {
        this.isConnected = connected;
      });
  }

  ngOnDestroy() { }

  private showCreateGamePopup(decks: SelectPopupOption<number>[]): Promise<CreateGamePopupResult> {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { decks }
    });
    return dialog.afterClosed().toPromise();
  }

  public createGame() {
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
              'You must prepare a valid deck before starting a game',
              'No valid decks'
            );
            return EMPTY;
          }

          return from(this.showCreateGamePopup(options));
        }),
        switchMap(result => {
          return result !== undefined
            ? this.deckService.getDeck(result.deckId).pipe(map(deckResult => ({
              deck: deckResult.deck.cards,
              gameSettings: result.gameSettings
            })))
            : EMPTY;
        })
      )
      .subscribe({
        next: data => {
          this.mainSevice.createGame(data.deck, data.gameSettings);
        },
        error: (error: ApiError) => {}
      });

  }

}
