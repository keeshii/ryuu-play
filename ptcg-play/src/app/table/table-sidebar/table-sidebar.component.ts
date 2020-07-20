import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { GameState, Player, State } from 'ptcg-server';

@Component({
  selector: 'ptcg-table-sidebar',
  templateUrl: './table-sidebar.component.html',
  styleUrls: ['./table-sidebar.component.scss']
})
export class TableSidebarComponent implements OnInit, OnChanges {

  @Output() join = new EventEmitter<void>();

  @Input() clientId: number;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;
  @Input() gameState: GameState;

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

  ngOnChanges() {
    if (!this.gameState) {
      this.turn = 0;
      this.gameId = undefined;
      this.isTopPlayerActive = false;
      this.isBottomPlayerActive = false;
      return;
    }

    const state = this.gameState.state;
    this.gameId = this.gameState.gameId;
    this.turn = state.turn;
    this.isTopPlayerActive = this.isPlayerActive(state, this.topPlayer);
    this.isBottomPlayerActive = this.isPlayerActive(state, this.bottomPlayer);
  }

}
