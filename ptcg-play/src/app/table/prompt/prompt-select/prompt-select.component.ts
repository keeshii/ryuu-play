import { Component, OnInit, Input } from '@angular/core';
import { SelectPrompt, GameState } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-select',
  templateUrl: './prompt-select.component.html',
  styleUrls: ['./prompt-select.component.scss']
})
export class PromptSelectComponent implements OnInit {

  @Input() set prompt(prompt: SelectPrompt) {
    this.promptId = prompt.id;
    this.message = prompt.message;
    this.options = prompt.values;
    this.allowCancel = prompt.options.allowCancel;
    this.result = prompt.options.defaultValue;
  }

  @Input() gameState: GameState;

  private promptId: number;
  public message: string;
  public allowCancel: boolean;
  public options: string[];
  public result = 0;

  constructor(private gameService: GameService) { }

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

  ngOnInit() {
  }

}
