import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Player, CardList } from 'ptcg-server';

@Component({
  selector: 'ptcg-board-prizes',
  templateUrl: './board-prizes.component.html',
  styleUrls: ['./board-prizes.component.scss']
})
export class BoardPrizesComponent implements OnChanges {

  @Input() player: Player;
  @Input() clientId: number;
  @Output() prizeClick = new EventEmitter<CardList>();

  public prizes: CardList[] = new Array(6);
  public isOwner: boolean;

  constructor() { }

  ngOnChanges() {
    if (this.player) {
      this.prizes = this.player.prizes;
      this.isOwner = this.player.id === this.clientId;
    } else {
      this.prizes = new Array(6);
      this.isOwner = false;
    }
  }

  public onPrizeClick(cardList: CardList) {
    this.prizeClick.next(cardList);
  }

}
