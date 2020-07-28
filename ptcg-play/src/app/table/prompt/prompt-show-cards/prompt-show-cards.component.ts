import { Component, OnInit, Input } from '@angular/core';
import { ShowCardsPrompt, GameState } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-show-cards',
  templateUrl: './prompt-show-cards.component.html',
  styleUrls: ['./prompt-show-cards.component.scss']
})
export class PromptShowCardsComponent implements OnInit {

  @Input() prompt: ShowCardsPrompt;
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
