import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckCard } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-pane/deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from 'src/app/api/services/deck.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit, OnDestroy {

  public loading = false;
  public deckName: string;
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
        this.deckName = response.deck.name;
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
      count: 1
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
            count: 1
          };
          deckCards.push(cardMap[name]);
        }
      }
    }

    return deckCards;
  }

  public addCardToDeck(card: DeckCard) {
    const index = this.deckCards.findIndex(c => c.fullName === card.fullName);
    this.deckCards = this.deckCards.slice();

    if (index === -1) {
      this.deckCards.push({
        ...card,
        pane: DeckEditPane.DECK,
        count: 1
      });
      return;
    }

    this.deckCards[index].count++;
  }

  public removeCardFromDeck(card: DeckCard) {
    const index = this.deckCards.findIndex(c => c.fullName === card.fullName);
    if (index === -1) {
      return;
    }
    this.deckCards = this.deckCards.slice();

    if (this.deckCards[index].count <= 1) {
      this.deckCards.splice(index, 1);
      return;
    }
    this.deckCards[index].count--;
  }

}
