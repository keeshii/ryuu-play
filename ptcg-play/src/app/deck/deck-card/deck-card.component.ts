import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { DeckCard } from './deck-card.interface';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit, OnDestroy {

  @Input() card: DeckCard;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
