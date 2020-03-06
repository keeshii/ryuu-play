import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Player, Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit, OnChanges {

  @Input() player: Player;
  @Input() clientId: number;

  public cards: Card[] = [];
  public isFaceDown: boolean;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.player) {
      const hand = this.player.hand;
      const isOwner = this.player.id === this.clientId;
      this.cards = hand.cards;
      this.isFaceDown = hand.isSecret || (!hand.isPublic && !isOwner);
    } else {
      this.cards = [];
    }
  }

}
