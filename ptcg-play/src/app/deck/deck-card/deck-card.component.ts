import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { DragSource } from '@angular-skyhook/core';

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

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
