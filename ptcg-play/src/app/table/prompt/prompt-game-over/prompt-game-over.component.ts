import { Component, Input } from '@angular/core';
import { GameWinner } from 'ptcg-server';

import { GameOverPrompt } from './game-over.prompt';
import { LocalGameState } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';

@Component({
  selector: 'ptcg-prompt-game-over',
  templateUrl: './prompt-game-over.component.html',
  styleUrls: ['./prompt-game-over.component.scss']
})
export class PromptGameOverComponent {

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

}
