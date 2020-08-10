import { Component, OnInit, Input } from '@angular/core';
import { GameState, GameWinner } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-game-over',
  templateUrl: './prompt-game-over.component.html',
  styleUrls: ['./prompt-game-over.component.scss']
})
export class PromptGameOverComponent implements OnInit {

  @Input() prompt: any;
  @Input() gameState: GameState;

  public GameWinner = GameWinner;

  constructor(private gameService: GameService) { }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, true);
  }

  ngOnInit() {
  }

}
