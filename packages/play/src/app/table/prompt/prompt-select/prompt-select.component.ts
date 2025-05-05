import { Component, Input } from '@angular/core';
import { SelectPrompt } from '@ptcg/common';
import { TranslateService } from '@ngx-translate/core';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-select',
  templateUrl: './prompt-select.component.html',
  styleUrls: ['./prompt-select.component.scss']
})
export class PromptSelectComponent {

  @Input() set prompt(prompt: SelectPrompt) {
    this.promptId = prompt.id;
    this.message = prompt.message;
    this.options = prompt.values.map(value => {
      return this.translate.instant('GAME_MESSAGES.' + value);
    });
    this.allowCancel = prompt.options.allowCancel;
    this.result = prompt.options.defaultValue;
  }

  @Input() gameState: LocalGameState;

  private promptId: number;
  public message: string;
  public allowCancel: boolean;
  public options: string[];
  public result = 0;

  constructor(
    private gameService: GameService,
    private translate: TranslateService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, this.result);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

}
