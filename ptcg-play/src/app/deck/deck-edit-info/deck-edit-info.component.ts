import { Component, OnInit, Input } from '@angular/core';
import { DeckItem } from '../deck-card/deck-card.interface';

@Component({
  selector: 'ptcg-deck-edit-info',
  templateUrl: './deck-edit-info.component.html',
  styleUrls: ['./deck-edit-info.component.scss']
})
export class DeckEditInfoComponent implements OnInit {

  public cardsCount = 0;

  @Input() set deckItems(value: DeckItem[]) {
    this.cardsCount = value.reduce((prev, val) => prev + val.count, 0);
  }

  constructor() { }

  ngOnInit() {
  }

}
