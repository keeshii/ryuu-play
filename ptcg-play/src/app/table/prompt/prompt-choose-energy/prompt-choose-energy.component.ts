import { Component, OnInit, Input } from '@angular/core';
import { ChooseEnergyPrompt, GameState, CardList, Card, SuperType, CardType, StateUtils } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-choose-energy',
  templateUrl: './prompt-choose-energy.component.html',
  styleUrls: ['./prompt-choose-energy.component.scss']
})
export class PromptChooseEnergyComponent implements OnInit {

  @Input() set prompt(prompt: ChooseEnergyPrompt) {
    this.cards = prompt.cards;
    this.filter = { superType: SuperType.ENERGY };
    this.allowedCancel = prompt.options.allowCancel;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.cost = prompt.cost;
  }

  @Input() gameState: GameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public isInvalid = false;
  private cost: CardType[];
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

  protected onChange(result: number[]) {
    const cards: Card[] = [];
    for (const index of result) {
      cards.push(this.cards.cards[index]);
    }

    const enough = StateUtils.checkExactEnergy(cards, this.cost);
    this.result = result;
    this.isInvalid = !enough;
  }

  ngOnInit() {
  }

}
