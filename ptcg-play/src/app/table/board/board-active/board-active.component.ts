import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {CardList, Player} from 'ptcg-server';

@Component({
  selector: 'ptcg-board-active',
  templateUrl: './board-active.component.html',
  styleUrls: ['./board-active.component.scss']
})
export class BoardActiveComponent implements OnInit, OnChanges {

  @Input() player: Player;
  @Input() clientId: number;

  public cardList: CardList;
  public isOwner: boolean;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.player) {
      this.cardList = this.player.active;
      this.isOwner = this.player.id === this.clientId;
    } else {
      this.cardList = undefined;
      this.isOwner = false;
    }
  }

}
