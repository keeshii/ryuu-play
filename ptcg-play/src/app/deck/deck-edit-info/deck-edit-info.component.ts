import { Component, OnInit, Input } from '@angular/core';
import { DeckCard } from '../deck-card/deck-card.interface';

@Component({
  selector: 'ptcg-deck-edit-info',
  templateUrl: './deck-edit-info.component.html',
  styleUrls: ['./deck-edit-info.component.scss']
})
export class DeckEditInfoComponent implements OnInit {

  public cardsCount = 0;
  public deckCards: DeckCard[] = [];

  @Input() set cards(value: DeckCard[]) {
    this.deckCards = value;
    this.cardsCount = this.deckCards.reduce((prev, val) => prev + val.count, 0);
  }

  constructor() { }

  ngOnInit() {
  }

}
