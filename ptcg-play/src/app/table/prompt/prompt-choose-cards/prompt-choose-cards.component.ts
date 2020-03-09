import { Component, OnInit, Input } from '@angular/core';
import { ChooseCardsPrompt, GameState, CardList, Card } from 'ptcg-server';

import { GameService } from 'src/app/api/services/game.service';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent implements OnInit {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.allowedCancel = prompt.options.allowCancel;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.buildFilterMap();
    this.message = prompt.message;
    this.promptId = prompt.id;
  }

  @Input() gameState: GameState;

  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public cards: CardList;
  public filter: Partial<Card>;
  public filterMap: {[fullName: string]: boolean} = {};

  constructor(private gameService: GameService) { }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, 0);
  }

  private buildFilterMap() {
    this.filterMap = {};
    for (const card of this.cards.cards) {
      let result = false;
      for (const key in this.filter) {
        if (this.filter.hasOwnProperty(key)) {
          result = result || this.filter[key] !== card[key];
        }
      }
      this.filterMap[card.fullName] = !result;
    }
  }

  ngOnInit() {
  }

}
