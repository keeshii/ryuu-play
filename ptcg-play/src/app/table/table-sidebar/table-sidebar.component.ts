import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GameState, Player } from 'ptcg-server';

@Component({
  selector: 'ptcg-table-sidebar',
  templateUrl: './table-sidebar.component.html',
  styleUrls: ['./table-sidebar.component.scss']
})
export class TableSidebarComponent implements OnInit {

  @Output() join = new EventEmitter<void>();

  @Input() set state(gameState: GameState) {
    this.gameState = gameState;

    if (!gameState || !gameState.state) {
      return;
    }

    this.gameId = gameState.gameId;
    this.turn = gameState.state.turn;
    this.player1 = gameState.state.players[0];
    this.player2 = gameState.state.players[1];
  }

  private gameState: GameState;
  public turn: number;
  public gameId: number;
  public player1: Player;
  public player2: Player;

  constructor() { }

  ngOnInit() {
  }

}
