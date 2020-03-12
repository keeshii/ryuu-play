import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GameState, Player, State } from 'ptcg-server';

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
    this.isTopPlayerActive = this.isPlayerActive(value.state, this.topPlayer);
    this.isBottomPlayerActive = this.isPlayerActive(value.state, this.bottomPlayer);
  }

  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  public turn: number;
  public gameId: number;
  public isTopPlayerActive: boolean;
  public isBottomPlayerActive: boolean;

  constructor() { }

  ngOnInit() {
  }

  private isPlayerActive(state: State, player: Player): boolean {
    if (!state || !player || !state.players[state.activePlayer]) {
      return false;
    }
    return player.id === state.players[state.activePlayer].id;
  }

}
