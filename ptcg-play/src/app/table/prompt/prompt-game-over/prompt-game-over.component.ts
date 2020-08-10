import { Component, OnInit, Input } from '@angular/core';
import { GameWinner } from 'ptcg-server';

import { LocalGameState, SessionService } from '../../../shared/session/session.service';
import { GameOverPrompt } from './game-over.prompt';

@Component({
  selector: 'ptcg-prompt-game-over',
  templateUrl: './prompt-game-over.component.html',
  styleUrls: ['./prompt-game-over.component.scss']
})
export class PromptGameOverComponent implements OnInit {

  @Input() prompt: GameOverPrompt;
  @Input() gameState: LocalGameState;

  public GameWinner = GameWinner;

  constructor(
    private sessionService: SessionService
  ) { }

  public confirm() {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.localId === this.gameState.localId);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      gameStates[index] = { ...gameStates[index], gameOver: true };
      this.sessionService.set({ gameStates });
    }
  }

  ngOnInit() {
  }

}
