import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SuperType, EnergyCard, EnergyType } from 'ptcg-server';
import { switchMap, finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckCard } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-pane/deck-edit-pane.interface';
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

  private async askForEnergyCount(card: DeckCard, maxValue?: number): Promise<number> {
    const DEFAULT_VALUE = 1;

    if (card.superType !== SuperType.ENERGY) {
      return DEFAULT_VALUE;
    }

    const energyCard: EnergyCard = card as any;
    if (energyCard.energyType !== EnergyType.BASIC) {
      return DEFAULT_VALUE;
    }

    const count = await this.alertService.inputNumber({
      title: 'How many energy cards?',
      value: 1,
      minValue: 1,
      maxValue
    });
    return count === undefined ? 0 : count;
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

  public async addCardToDeck(card: DeckCard) {
    const CARDS_IN_DECK = 60;
    const index = this.deckCards.findIndex(c => c.fullName === card.fullName);
    const count = await this.askForEnergyCount(card, CARDS_IN_DECK);
    if (count === 0) {
      return;
    }

    this.deckCards = this.deckCards.slice();
    if (index === -1) {
      this.deckCards.push({
        ...card,
        pane: DeckEditPane.DECK,
        count
      });
      return;
    }

    this.deckCards[index].count += count;
  }

  public async removeCardFromDeck(card: DeckCard) {
    const index = this.deckCards.findIndex(c => c.fullName === card.fullName);
    if (index === -1) {
      return;
    }

    const count = await this.askForEnergyCount(card, card.count);
    if (count === 0) {
      return;
    }

    this.deckCards = this.deckCards.slice();

    if (this.deckCards[index].count <= count) {
      this.deckCards.splice(index, 1);
      return;
    }
    this.deckCards[index].count -= count;
  }

}
