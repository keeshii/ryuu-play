import { Component, OnInit, Input } from '@angular/core';
import { Player, Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  public cards: Card[] = [];

  @Input() set player(value: Player) {
    if (!value) {
      this.cards = [];
      return;
    }
    this.cards = value.hand.cards;
  }

  @Input() clientId: number;

  constructor() { }

  ngOnInit() {
  }

}
