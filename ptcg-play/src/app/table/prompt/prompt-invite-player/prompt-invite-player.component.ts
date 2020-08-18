import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameState, InvitePlayerPrompt } from 'ptcg-server';
import { finalize, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../api/api.error';
import { AlertService } from '../../../shared/alert/alert.service';
import { DeckService } from 'src/app/api/services/deck.service';
import { GameService } from '../../../api/services/game.service';
import { SelectPopupOption } from '../../../shared/alert/select-popup/select-popup.component';
import { takeUntilDestroyed} from '../../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-prompt-invite-player',
  templateUrl: './prompt-invite-player.component.html',
  styleUrls: ['./prompt-invite-player.component.scss']
})
export class PromptInvitePlayerComponent implements OnInit, OnDestroy {

  @Input() prompt: InvitePlayerPrompt;
  @Input() gameState: GameState;

  public loading = true;
  public decks: SelectPopupOption<number>[] = [];
  public deckId: number;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private gameService: GameService
  ) { }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;

    this.loading = true;
    this.deckService.getDeck(this.deckId)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: deckResponse => {
          const deck = deckResponse.deck.cards;
          this.gameService.resolvePrompt(gameId, id, deck);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  private loadDecks() {
    this.loading = true;
    this.deckService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this),
      ).
      subscribe({
        next: decks => {
          this.decks = decks.decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => ({value: deckEntry.id, viewValue: deckEntry.name}));
          if (this.decks.length > 0) {
            this.deckId = this.decks[0].value;
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
          this.decks = [];
        }
      });
  }

  ngOnInit() {
    this.loadDecks();
  }

  ngOnDestroy() { }

}