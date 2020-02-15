import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckCard } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from '../../api/services/deck.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit, OnDestroy {

  public loading = false;
  public deck: Deck;
  public cards: DeckCard[] = [];
  public deckCards: DeckCard[] = [];
  public toolbarFilter: DeckEditToolbarFilter;
  public DeckEditPane = DeckEditPane;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.cards = this.loadLibraryCards();

    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const deckId = parseInt(paramMap.get('deckId'), 10);
        return this.deckService.getDeck(deckId);
      }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.deck = response.deck;
        this.deckCards = this.loadDeckCards(response.deck.cards);
      }, async error => {
        await this.alertService.error('Error while loading the deck');
        this.router.navigate(['/decks']);
      });
  }

  ngOnDestroy() { }

  private loadLibraryCards(): DeckCard[] {
    return this.cardsBaseService.getCards().map(card => ({
      ...card,
      pane: DeckEditPane.LIBRARY,
      count: 1,
      scanUrl: this.cardsBaseService.getScanUrl(card.fullName)
    }));
  }

  private loadDeckCards(cardNames: string[]): DeckCard[] {
    const cardMap: { [name: string]: DeckCard } = {};
    const deckCards: DeckCard[] = [];

    for (const name of cardNames) {
      if (cardMap[name] !== undefined) {
        cardMap[name].count++;
      } else {
        const card = this.cardsBaseService.getCardByName(name);
        if (card !== undefined) {
          cardMap[name] = {
            ...card,
            pane: DeckEditPane.DECK,
            count: 1,
            scanUrl: this.cardsBaseService.getScanUrl(name)
          };
          deckCards.push(cardMap[name]);
        }
      }
    }

    return deckCards;
  }

  public saveDeck() {
    if (!this.deck) {
      return;
    }

    const cards = [];
    for (const card of this.deckCards) {
      for (let i = 0; i < card.count; i++) {
        cards.push(card.fullName);
      }
    }

    this.loading = true;
    this.deckService.saveDeck(this.deck.id, this.deck.name, cards).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast('Deck saved.');
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

}
