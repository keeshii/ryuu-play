import { Component, OnInit, Input } from '@angular/core';
import { AlertPrompt, GameState } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-alert',
  templateUrl: './prompt-alert.component.html',
  styleUrls: ['./prompt-alert.component.scss']
})
export class PromptAlertComponent implements OnInit {

  @Input() prompt: AlertPrompt;
  @Input() gameState: GameState;

  constructor(private gameService: GameService) { }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, true);
  }

  ngOnInit() {
  }

}
