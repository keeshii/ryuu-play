import { Component, OnInit, Input } from '@angular/core';
import { PokemonCardList, Card, CardList, SuperType, SpecialCondition } from 'ptcg-server';

const MAX_ENERGY_CARDS = 4;

@Component({
  selector: 'ptcg-board-card-list',
  templateUrl: './board-card-list.component.html',
  styleUrls: ['./board-card-list.component.scss']
})
export class BoardCardListComponent implements OnInit {

  @Input() set cardList(value: CardList | PokemonCardList) {
    this.pokemonCard = undefined;
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
    this.isFaceDown = value.isSecret || (!value.isPublic && !this.owner);

    if (value instanceof PokemonCardList) {
      this.initPokemonCardList(value);
    }
  }

  @Input() showCardCount = false;
  @Input() owner = false;

  public isEmpty = true;
  public pokemonCard: Card;
  public moreEnergies = 0;
  public cardCount = 0;
  public energyCards: Card[] = [];
  public trainerCard: Card;
  public isFaceDown = false;
  public damage = 0;
  public specialConditions: SpecialCondition[] = [];
  public SpecialCondition = SpecialCondition;

  constructor() { }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;

    for (const card of cardList.cards) {
      switch (card.superType) {
      case SuperType.ENERGY:
        if (this.energyCards.length < MAX_ENERGY_CARDS) {
          this.energyCards.push(card);
        } else {
          this.moreEnergies++;
        }
        break;
      case SuperType.TRAINER:
        this.trainerCard = card;
        break;
      case SuperType.POKEMON:
        this.pokemonCard = card;
        break;
      }
    }
  }

  ngOnInit() { }

}
