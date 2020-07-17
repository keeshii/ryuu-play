import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PokemonCardList, Card, CardList, SuperType, SpecialCondition, PokemonCard } from 'ptcg-server';

const MAX_ENERGY_CARDS = 4;

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit {

  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<Card>();

  @Input() set cardList(value: CardList | PokemonCardList) {
    this.mainCard = undefined;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;

    this.isEmpty = !value || !value.cards.length;
    if (this.isEmpty) {
      return;
    }

    const cards: Card[] = value.cards;
    this.cardCount = cards.length;
    this.isSecret = value.isSecret;
    this.isPublic = value.isPublic;
    this.isFaceDown = value.isSecret || (!value.isPublic && !this.isOwner);

    // Pokemon slot, init energies, tool, special conditions, etc.
    if (this.isPokemonCardList(value)) {
      this.initPokemonCardList(value as PokemonCardList);
      return;
    }

    // Normal card list, display top-card only
    this.mainCard = value.cards[value.cards.length - 1];
  }

  @Input() set owner(value: boolean) {
    this.isOwner = value;
    const isFaceDown = this.isSecret || (!this.isPublic && !this.isOwner);
    this.isFaceDown = !this.isEmpty && isFaceDown;
  }

  @Input() set card(value: Card) {
    this.mainCard = value;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isEmpty = !value;
  }

  @Input() isFaceDown = false;

  public isEmpty = true;
  public mainCard: Card;
  public moreEnergies = 0;
  public cardCount = 0;
  public energyCards: Card[] = [];
  public trainerCard: Card;
  public damage = 0;
  public specialConditions: SpecialCondition[] = [];
  public SpecialCondition = SpecialCondition;

  private isSecret = false;
  private isPublic = false;
  private isOwner = false;

  constructor() { }

  private isPokemonCardList(cardList: CardList) {
    return (cardList as PokemonCardList).specialConditions !== undefined;
  }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.trainerCard = undefined;

    if (cardList.tool !== undefined) {
      this.trainerCard = cardList.cards
        .find(c => c.fullName === cardList.tool.fullName);
    }

    for (const card of cardList.cards) {
      switch (card.superType) {
      case SuperType.ENERGY:
        if (this.energyCards.length < MAX_ENERGY_CARDS) {
          this.energyCards.push(card);
        } else {
          this.moreEnergies++;
        }
        break;
      case SuperType.POKEMON:
        const pokemonCard = card as PokemonCard;
        const mainCard = this.mainCard as PokemonCard;
        if (pokemonCard !== this.trainerCard) {
          if (!mainCard || mainCard.stage < pokemonCard.stage) {
            this.mainCard = pokemonCard;
          }
        }
        break;
      }
    }
  }

  ngOnInit() { }

  public onCardClick(card: Card) {
    this.cardClick.next(card);
  }

}
