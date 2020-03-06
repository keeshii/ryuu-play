import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Player, CardList} from 'ptcg-server';

@Component({
  selector: 'ptcg-board-deck',
  templateUrl: './board-deck.component.html',
  styleUrls: ['./board-deck.component.scss']
})
export class BoardDeckComponent implements OnInit, OnChanges {

  @Input() player: Player;
  @Input() clientId: number;

  public deck: CardList;
  public discard: CardList;
  public isOwner: boolean;

  constructor() { }

  ngOnInit() { }

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

}
