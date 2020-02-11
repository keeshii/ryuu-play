import { Pipe, PipeTransform } from '@angular/core';

import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { Card, CardType, SuperType, PokemonCard, EnergyCard } from 'ptcg-server';

@Pipe({
  name: 'filterCards'
})
export class FilterCardsPipe implements PipeTransform {

  transform(cards: Card[], filter: DeckEditToolbarFilter): any {

    if (filter === undefined) {
      return cards;
    }

    if (filter.searchValue === ''
      && filter.superTypes.length === 0
      && filter.cardTypes.length === 0) {
      return cards;
    }

    return cards.filter(card => {
      if (filter.searchValue !== '' && card.name.indexOf(filter.searchValue) === -1) {
        return false;
      }

      if (filter.superTypes.length && !filter.superTypes.includes(card.superType)) {
        return false;
      }

      if (filter.cardTypes.length && !filter.cardTypes.includes(this.getCardType(card))) {
        return false;
      }

      return true;
    });
  }

  private getCardType(card: Card): CardType {
    if (card.superType === SuperType.POKEMON) {
      return (card as PokemonCard).cardType;
    }
    if (card.superType === SuperType.ENERGY) {
      return (card as EnergyCard).provides;
    }
    return CardType.NONE;
  }

}
