import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GameState } from 'ptcg-server';
import { GameService } from 'src/app/api/services/game.service';

@Component({
  selector: 'ptcg-player-actions',
  templateUrl: './player-actions.component.html',
  styleUrls: ['./player-actions.component.scss']
})
export class PlayerActionsComponent implements OnInit {

  @Input() gameState: GameState;
  @Input() clientId: number;

  @Output() join = new EventEmitter<void>();

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit() {
  }

  public passTurn() {
    if (!this.gameState || !this.gameState.gameId) {
      return;
    }
    this.gameService.passTurnAction(this.gameState.gameId);
  }

}
