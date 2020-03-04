import { Component, OnInit, Input } from '@angular/core';
import { GameState, Player } from 'ptcg-server';

@Component({
  selector: 'ptcg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() clientId: number;
  @Input() gameState: GameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  constructor() { }

  ngOnInit() {
  }

}
