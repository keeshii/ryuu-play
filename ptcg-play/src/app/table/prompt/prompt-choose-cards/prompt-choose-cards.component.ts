import { Component, Input } from '@angular/core';
import { ChooseCardsPrompt, CardList, Card } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.promptValue = prompt;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.allowedCancel = prompt.options.allowCancel;
    this.blocked = prompt.options.blocked;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.isSecret = prompt.options.isSecret;

    if (prompt.options.isSecret) {
      prompt.cards.cards.forEach((c, i) => {
        this.cardbackMap[i] = true;
      });
    }
  }

  @Input() gameState: LocalGameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public blocked: number[];
  public isInvalid = false;
  public isSecret: boolean;
  public revealed = false;
  public cardbackMap: {[index: number]: boolean} = {};
  private promptValue: ChooseCardsPrompt;
  private result: number[] = [];

  constructor(
    private gameService: GameService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, this.result);
  }

  public onChange(result: number[]) {
    const cards = result.map(index => this.cards.cards[index]);
    const isInvalid = !this.promptValue.validate(cards);
    this.result = result;
    this.isInvalid = isInvalid;
  }

}
