import { Component, OnInit, Input } from '@angular/core';
import { GameState, CardList, OrderCardsPrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-order-cards',
  templateUrl: './prompt-order-cards.component.html',
  styleUrls: ['./prompt-order-cards.component.scss']
})
export class PromptOrderCardsComponent implements OnInit {

  @Input() set prompt(prompt: OrderCardsPrompt) {
    this.cards = prompt.cards;
    this.allowedCancel = prompt.options.allowCancel;
    this.message = prompt.message;
    this.promptId = prompt.id;
  }

  @Input() gameState: GameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  private result: number[] = [];

  constructor(
    private gameService: GameService
  ) { }

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
    this.result = result;
  }

  ngOnInit() {
  }

}