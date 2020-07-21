import { Component, OnInit, Input } from '@angular/core';
import { ChooseEnergyPrompt, GameState, CardList, Card, SuperType, CardType,
  StateUtils, EnergyMap } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-choose-energy',
  templateUrl: './prompt-choose-energy.component.html',
  styleUrls: ['./prompt-choose-energy.component.scss']
})
export class PromptChooseEnergyComponent implements OnInit {

  @Input() set prompt(prompt: ChooseEnergyPrompt) {
    const cardList = new CardList();
    cardList.cards = prompt.energy.map(map => map.card);
    this.cards = cardList;
    this.energy = prompt.energy;
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
  private energy: EnergyMap[] = [];
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
    const energy: EnergyMap[] = [];
    for (const index of result) {
      energy.push(this.energy[index]);
    }

    const enough = StateUtils.checkExactEnergy(energy, this.cost);
    this.result = result;
    this.isInvalid = !enough;
  }

  ngOnInit() {
  }

}
