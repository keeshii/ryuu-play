import { Component, Input, OnChanges } from '@angular/core';
import { Card, ChoosePrizePrompt } from '@ryuu-play/ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-prize',
  templateUrl: './prompt-choose-prize.component.html',
  styleUrls: ['./prompt-choose-prize.component.scss']
})
export class PromptChoosePrizeComponent implements OnChanges {

  @Input() prompt: ChoosePrizePrompt;
  @Input() gameState: LocalGameState;

  public cards: Card[];
  public cardbackMap: {[index: number]: boolean} = {};
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;
  public hasSecret: boolean;
  public revealed = false;
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
    const count = this.prompt.options.count;
    this.result = result;
    this.isInvalid = result.length !== count;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const player = state.players.find(p => p.id === this.prompt.playerId);
      if (player === undefined) {
        return;
      }

      const cards: Card[] = [];
      const cardbackMap: {[index: number]: boolean} = {};
      player.prizes.forEach((prize) => {
        prize.cards.forEach(card => {
          cardbackMap[cards.length] = prize.isSecret;
          cards.push(card);
        });
      });

      this.hasSecret = player.prizes.some(p => p.cards.length > 0 && p.isSecret);
      this.cards = cards;
      this.cardbackMap = cardbackMap;
      this.allowedCancel = prompt.options.allowCancel;
      this.message = prompt.message;
      this.promptId = prompt.id;
    }
  }

}
