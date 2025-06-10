import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PokemonSlot, Card, CardList, SpecialCondition } from '@ptcg/common';

const MAX_ENERGY_CARDS = 4;

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent {

  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<{card: Card, cardList: CardList}>();

  @Input() set value(value: CardList | PokemonSlot) {
    this.pokemonSlot = undefined;
    this.cardList = undefined;
    this.mainCard = undefined;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;

    if (value instanceof CardList) {
      this.cardList = value;
    }
    if (value instanceof PokemonSlot) {
      this.pokemonSlot = value;
      this.cardList = value.pokemons;
    }

    this.isEmpty = !this.cardList || !this.cardList.cards.length;
    if (this.isEmpty) {
      return;
    }

    const cards: Card[] = this.cardList.cards;
    this.cardCount = cards.length;
    this.isSecret = this.cardList.isSecret;
    this.isPublic = this.cardList.isPublic;
    this.isFaceDown = this.cardList.isSecret || (!this.cardList.isPublic && !this.isOwner);

    // Pokemon slot, init energies, tool, special conditions, etc.
    if (value instanceof PokemonSlot) {
      this.initPokemonCardList(value);
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

  public pokemonSlot: PokemonSlot;
  public cardList: CardList;
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

  private initPokemonCardList(pokemonSlot: PokemonSlot) {
    this.damage = pokemonSlot.damage;
    this.specialConditions = pokemonSlot.specialConditions;
    this.mainCard = pokemonSlot.getPokemonCard();
    if (pokemonSlot.trainers.cards.length > 0) {
      this.trainerCard = pokemonSlot.trainers.cards[0];
    }

    for (const card of pokemonSlot.energies.cards) {
      if (this.energyCards.length < MAX_ENERGY_CARDS) {
        this.energyCards.push(card);
      } else {
        this.moreEnergies++;
      }
    }
  }

  public onCardClick(card: Card, cardList: CardList) {
    this.cardClick.next({ card, cardList });
  }

}
