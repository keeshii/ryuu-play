import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import {Player, CardList, Card} from 'ptcg-server';

@Component({
  selector: 'ptcg-board-deck',
  templateUrl: './board-deck.component.html',
  styleUrls: ['./board-deck.component.scss']
})
export class BoardDeckComponent implements OnChanges {

  @Input() player: Player;
  @Input() clientId: number;
  @Output() deckClick = new EventEmitter<Card>();
  @Output() discardClick = new EventEmitter<Card>();

  public deck: CardList;
  public discard: CardList;
  public isOwner: boolean;

  constructor() { }

  ngOnChanges() {
    if (this.player) {
      this.deck = this.player.deck;
      this.discard = this.player.discard;
      this.isOwner = this.player.id === this.clientId;
    } else {
      this.deck = undefined;
      this.discard = undefined;
      this.isOwner = false;
    }
  }

  public onDeckClick() {
    let card;
    if (this.deck && this.deck.cards.length > 0) {
      card = this.deck.cards[0];
    }
    this.deckClick.next(card);
  }

  public onDiscardClick(card: Card) {
    this.discardClick.next(card);
  }

}
