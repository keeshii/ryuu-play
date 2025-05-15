import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { InvitePlayerPrompt } from '@ptcg/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../../api/api.error';
import { AlertService } from '../../../shared/alert/alert.service';
import { DeckService } from 'src/app/api/services/deck.service';
import { GameService } from '../../../api/services/game.service';
import { SelectPopupOption } from '../../../shared/alert/select-popup/select-popup.component';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-invite-player',
  templateUrl: './prompt-invite-player.component.html',
  styleUrls: ['./prompt-invite-player.component.scss']
})
export class PromptInvitePlayerComponent implements OnInit {

  @Input() prompt: InvitePlayerPrompt;
  @Input() gameState: LocalGameState;

  public loading = true;
  public decks: SelectPopupOption<number>[] = [];
  public deckId: number;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private gameService: GameService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

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
        takeUntilDestroyed(this.destroyRef),
      ).
      subscribe({
        next: decks => {
          const formatName = this.gameState.state.rules.formatName;

          this.decks = decks.decks
            .filter(deckEntry => deckEntry.isValid)
            .filter(deckEntry => !formatName || deckEntry.formatNames.includes(formatName))
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

}
