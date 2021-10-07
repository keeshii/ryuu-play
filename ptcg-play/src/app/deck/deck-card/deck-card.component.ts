import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DragSource } from '@ng-dnd/core';

import { DeckItem } from './deck-card.interface';

export const DeckCardType = 'DECK_CARD';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit, OnDestroy {

  @Input() source: DragSource<DeckItem, any>;
  @Input() card: DeckItem;
  @Input() showCardCount: boolean;

  @Output() cardClick = new EventEmitter<void>();
  @Output() countClick = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  onCountClick(event: MouseEvent) {
    event.stopPropagation();
    this.countClick.next();
  }

  onCardClick() {
    this.cardClick.next();
  }

}
