import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckItem } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from '../../api/services/deck.service';
import { FileDownloadService } from '../../shared/file-download/file-download.service';

@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {

  public loading = false;
  public deck: Deck;
  public deckItems: DeckItem[] = [];
  public toolbarFilter: DeckEditToolbarFilter;
  public DeckEditPane = DeckEditPane;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    private fileDownloadService: FileDownloadService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const deckId = parseInt(paramMap.get('deckId'), 10);
        return this.deckService.getDeck(deckId);
      }),
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe(response => {
        this.loading = false;
        this.deck = response.deck;
        this.deckItems = this.loadDeckItems(response.deck.cards);
      }, async () => {
        await this.alertService.error(this.translate.instant('DECK_EDIT_LOADING_ERROR'));
        this.router.navigate(['/decks']);
      });
  }

  private loadDeckItems(cardNames: string[]): DeckItem[] {
    const itemMap: { [name: string]: DeckItem } = {};
    const deckItems: DeckItem[] = [];

    for (const name of cardNames) {
      if (itemMap[name] !== undefined) {
        itemMap[name].count++;
      } else {
        const card = this.cardsBaseService.getCardByName(name);
        if (card !== undefined) {
          itemMap[name] = {
            card,
            count: 1,
            pane: DeckEditPane.DECK,
            scanUrl: this.cardsBaseService.getScanUrl(card)
          };
          deckItems.push(itemMap[name]);
        }
      }
    }

    return deckItems;
  }

  public importDeck(cardNames: string[]) {
    this.deckItems = this.loadDeckItems(cardNames);
  }

  public async exportDeck() {
    const cardNames = [];
    for (const item of this.deckItems) {
      for (let i = 0; i < item.count; i++) {
        cardNames.push(item.card.fullName);
      }
    }
    const data = cardNames.join('\n') + '\n';
    const fileName = this.deck.name + '.txt';
    try {
      await this.fileDownloadService.downloadFile(data, fileName);
      this.alertService.toast(this.translate.instant('DECK_EXPORTED'));
    } catch (error) {
      this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
    }
  }

  public saveDeck() {
    if (!this.deck) {
      return;
    }

    const items = [];
    for (const item of this.deckItems) {
      for (let i = 0; i < item.count; i++) {
        items.push(item.card.fullName);
      }
    }

    this.loading = true;
    this.deckService.saveDeck(this.deck.id, this.deck.name, items).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });
  }

}
