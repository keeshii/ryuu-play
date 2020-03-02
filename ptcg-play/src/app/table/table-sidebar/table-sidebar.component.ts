import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GameState, Player } from 'ptcg-server';

@Component({
  selector: 'ptcg-table-sidebar',
  templateUrl: './table-sidebar.component.html',
  styleUrls: ['./table-sidebar.component.scss']
})
export class TableSidebarComponent implements OnInit {

  @Output() join = new EventEmitter<void>();

  @Input() set gameState(value: GameState) {
    if (!value || !value.state) {
      return;
    }

    this.gameId = value.gameId;
    this.turn = value.state.turn;
  }

  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  public turn: number;
  public gameId: number;

  constructor() { }

  ngOnInit() {
  }

}
