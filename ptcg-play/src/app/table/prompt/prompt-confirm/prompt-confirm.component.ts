import { Component, OnInit, Input } from '@angular/core';
import { ConfirmPrompt, GameState } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-confirm',
  templateUrl: './prompt-confirm.component.html',
  styleUrls: ['./prompt-confirm.component.scss']
})
export class PromptConfirmComponent implements OnInit {

  @Input() prompt: ConfirmPrompt;
  @Input() gameState: GameState;

  constructor(private gameService: GameService) { }

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

  ngOnInit() {
  }

}
