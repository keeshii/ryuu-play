import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'ptcg-server';

@Component({
  selector: 'ptcg-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit {

  @Input() set player(player: Player) {
    this.isEmpty = !player;
    if (this.isEmpty) {
      return;
    }

    this.deckCount = player.deck.cards.length;
    this.handCount = player.hand.cards.length;
    this.discardCount = player.discard.cards.length;
    this.name = player.name;
  }

  @Input() active: boolean;

  public isEmpty = true;
  public deckCount: number;
  public handCount: number;
  public discardCount: number;
  public name: string;

  constructor() { }

  ngOnInit() {
  }

}
