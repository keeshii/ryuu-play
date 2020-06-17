import { Component, OnInit, Input } from '@angular/core';
import { GameState } from 'ptcg-server';

@Component({
  selector: 'ptcg-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss']
})
export class GameLogsComponent implements OnInit {

  @Input() gameState: GameState;

  constructor() { }

  ngOnInit() {
  }

}
