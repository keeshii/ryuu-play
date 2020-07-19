import { Component, OnInit, Input } from '@angular/core';
import { ChooseCardsPrompt, GameState, CardList, Card } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent implements OnInit {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.allowedCancel = prompt.options.allowCancel;
    this.blocked = prompt.options.blocked;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.min = prompt.options.min;
    this.max = prompt.options.max;
  }

  @Input() gameState: GameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public blocked: number[];
  public isInvalid = false;
  private min: number;
  private max: number;
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
    let isInvalid = false;
    if (this.min !== undefined && this.min > result.length) {
      isInvalid = true;
    }
    if (this.max !== undefined && this.max < result.length) {
      isInvalid = true;
    }
    this.result = result;
    this.isInvalid = isInvalid;
  }

  ngOnInit() {
  }

}
