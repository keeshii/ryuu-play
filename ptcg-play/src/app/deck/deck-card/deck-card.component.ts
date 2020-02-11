import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit, OnDestroy {

  @Input() card: Card;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
