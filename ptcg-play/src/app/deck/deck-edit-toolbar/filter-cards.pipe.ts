import { Pipe, PipeTransform } from '@angular/core';

import { CardEntry } from 'src/app/api/interfaces/cards.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';

@Pipe({
  name: 'filterCards'
})
export class FilterCardsPipe implements PipeTransform {

  transform(cards: CardEntry[], filter: DeckEditToolbarFilter): any {

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

      if (filter.cardTypes.length && !filter.cardTypes.includes(card.cardType)) {
        return false;
      }

      return true;
    });
  }

}
