import { Component, Input } from '@angular/core';
import { ConfirmPrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-confirm',
  templateUrl: './prompt-confirm.component.html',
  styleUrls: ['./prompt-confirm.component.scss']
})
export class PromptConfirmComponent {

  @Input() prompt: ConfirmPrompt;
  @Input() gameState: LocalGameState;

  constructor(private gameService: GameService) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, false);
  }

}
