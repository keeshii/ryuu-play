import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GameInfo, ClientInfo } from '@ptcg/common';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable, EMPTY, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, switchMap, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { ClientUserData } from '../api/interfaces/main.interface';
import { CreateGamePopupComponent, CreateGamePopupResult } from './create-game-popup/create-game-popup.component';
import { DeckService } from '../api/services/deck.service';
import { MainService } from '../api/services/main.service';
import { SessionService } from '../shared/session/session.service';
import { UserInfoMap } from '../shared/session/session.interface';
import { DeckListEntry } from '../api/interfaces/deck.interface';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public clients$: Observable<ClientUserData[]>;
  public games$: Observable<GameInfo[]>;
  public loading = false;
  public clientId: number;
  public loggedUserId: number;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private dialog: MatDialog,
    private mainSevice: MainService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.clients$ = this.sessionService.get(
      session => session.users,
      session => session.clients
    ).pipe(map(([users, clients]: [UserInfoMap, ClientInfo[]]) => {
      const values = clients.map(c => ({
        clientId: c.clientId,
        user: users[c.userId]
      }));
      values.sort((client1, client2) => {
        return client2.user.ranking - client1.user.ranking;
      });
      return values;
    }));

    this.games$ = this.sessionService.get(session => session.games);
  }

  ngOnInit() {
    this.sessionService.get(session => session.clientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(clientId => { this.clientId = clientId; });

    this.sessionService.get(session => session.loggedUserId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loggedUserId => { this.loggedUserId = loggedUserId; });

  }

  private showCreateGamePopup(decks: DeckListEntry[]): Promise<CreateGamePopupResult> {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { decks }
    });
    return dialog.afterClosed().toPromise();
  }

  public createGame(invitedId?: number) {
    this.loading = true;
    this.deckService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this.destroyRef),
        switchMap(decks => {
          const options = decks.decks
            .filter(deckEntry => deckEntry.isValid);

          if (options.length === 0) {
            this.alertService.alert(
              this.translate.instant('GAMES_NEED_DECK'),
              this.translate.instant('GAMES_NEED_DECK_TITLE')
            );
            return EMPTY;
          }

          return from(this.showCreateGamePopup(options));
        }),
        switchMap(result => {
          this.loading = true;
          return result !== undefined
            ? this.deckService.getDeck(result.deckId).pipe(map(deckResult => ({
              deck: deckResult.deck.cards,
              gameSettings: result.gameSettings
            })))
            : EMPTY;
        }),
        switchMap(data => {
          return this.mainSevice.createGame(data.deck, data.gameSettings, invitedId);
        }),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: () => {},
        error: (error: ApiError) => {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      });

  }

}
