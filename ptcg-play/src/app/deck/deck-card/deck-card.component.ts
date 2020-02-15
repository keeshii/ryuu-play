import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';

import { DeckCard } from './deck-card.interface';
import {CardComponent} from '../../shared/cards/card/card.component';

export const DeckCardType = 'DECK_CARD';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit, OnDestroy {

  @ViewChild(CardComponent, {static: true}) ptcgCard: CardComponent;

  @Input() card: DeckCard;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
