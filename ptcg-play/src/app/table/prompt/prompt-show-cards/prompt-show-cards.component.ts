import { Component, OnInit, Input } from '@angular/core';
import { ShowCardsPrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-show-cards',
  templateUrl: './prompt-show-cards.component.html',
  styleUrls: ['./prompt-show-cards.component.scss']
})
export class PromptShowCardsComponent implements OnInit {

  @Input() prompt: ShowCardsPrompt;
  @Input() gameState: LocalGameState;

  constructor(private gameService: GameService) { }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, true);
  }

  ngOnInit() {
  }

}
