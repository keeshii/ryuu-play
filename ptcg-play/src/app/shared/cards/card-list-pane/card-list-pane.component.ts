import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CardList, Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-card-list-pane',
  templateUrl: './card-list-pane.component.html',
  styleUrls: ['./card-list-pane.component.scss']
})
export class CardListPaneComponent implements OnInit {

  @Input() cardList: CardList;
  @Input() selected: Card | undefined;
  @Input() facedown: boolean;
  @Output() cardClick = new EventEmitter<Card>();

  constructor() { }

  ngOnInit(): void {
  }

  selectCard(card: Card) {
    this.cardClick.next(card);
  }

}
