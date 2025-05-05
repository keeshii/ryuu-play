import { Component, Input } from '@angular/core';
import { ShowCardsPrompt, Card } from '@ptcg/common';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-show-cards',
  templateUrl: './prompt-show-cards.component.html',
  styleUrls: ['./prompt-show-cards.component.scss']
})
export class PromptShowCardsComponent {

  @Input() prompt: ShowCardsPrompt;
  @Input() gameState: LocalGameState;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

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
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public onCardClick(card: Card) {
    this.cardsBaseService.showCardInfo({ card });
  }

}
