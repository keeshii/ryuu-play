import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GameState, Card, MoveEnergyPrompt, SuperType, EnergyCard,
  EnergyType, PokemonCardList} from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

interface MoveEnergyResult {
  from: PokemonCardList;
  to: PokemonCardList;
  card: Card;
}

@Component({
  selector: 'ptcg-prompt-move-energy',
  templateUrl: './prompt-move-energy.component.html',
  styleUrls: ['./prompt-move-energy.component.scss']
})
export class PromptMoveEnergyComponent implements OnInit, OnChanges {

  @Input() prompt: MoveEnergyPrompt;
  @Input() gameState: GameState;

  public pokemonData: PokemonData;
  public cardList: PokemonCardList | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<EnergyCard>;
  public isInvalid = false;
  private result: MoveEnergyResult[] = [];

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
    this.gameService.resolvePrompt(gameId, id, null);
    // this.gameService.resolvePrompt(gameId, id, this.result);
  }

  ngOnInit() {
  }

  public onCardClick(item: PokemonItem) {
    this.pokemonData.unselectAll();
    item.selected = true;
    this.cardList = item.cardList;
  }

  public onCardDrop([item, card]: [PokemonItem, Card]) {
    if (item.cardList === this.cardList) {
      return;
    }

    const result: MoveEnergyResult = {
      from: this.cardList,
      to: item.cardList,
      card
    };

    const index = result.from.cards.indexOf(card);
    if (index === -1) {
      return;
    }
    result.from.cards.splice(index, 1);
    result.to.cards.push(card);
    this.result.push(result);
  }

  private buildFilter(prompt: MoveEnergyPrompt): Partial<Card> {
    const basicEnergy = prompt.options.moveBasicEnergy;
    const specialEnergy = prompt.options.moveSpecialEnergy;
    const filter: Partial<EnergyCard> = { superType: SuperType.ENERGY };

    if (basicEnergy && !specialEnergy) {
      filter.energyType = EnergyType.BASIC;
    } else if (!basicEnergy && specialEnergy) {
      filter.energyType = EnergyType.SPECIAL;
    }

    return filter;
  }

  private updateIsInvalid() {
    this.isInvalid = false;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.allowedCancel = prompt.options.allowCancel;
      this.filter = this.buildFilter(prompt);
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.cardList = undefined;
      this.result = [];
      this.updateIsInvalid();
    }
  }

}
