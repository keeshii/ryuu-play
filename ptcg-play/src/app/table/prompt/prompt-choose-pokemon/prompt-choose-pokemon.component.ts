import { Component, Input, OnChanges } from '@angular/core';
import { ChoosePokemonPrompt, CardTarget } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

@Component({
  selector: 'ptcg-prompt-choose-pokemon',
  templateUrl: './prompt-choose-pokemon.component.html',
  styleUrls: ['./prompt-choose-pokemon.component.scss']
})
export class PromptChoosePokemonComponent implements OnChanges {

  @Input() prompt: ChoosePokemonPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public blocked: CardTarget[];
  public isInvalid = false;

  private min = 1;
  private max = 1;

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
    const result = this.pokemonData.getSelectedTargets();
    this.gameService.resolvePrompt(gameId, id, result);
  }

  public onCardClick(item: PokemonItem) {
    if (this.pokemonData.matchesTarget(item, this.blocked)) {
      return;
    }

    // If we are selecting only one card, unselect all first
    if (this.max === 1) {
      this.pokemonData.unselectAll();
    }

    item.selected = !item.selected;
    this.updateIsInvalid();
  }

  private updateIsInvalid() {
    const selected = this.pokemonData.countSelected();
    this.isInvalid = this.min > selected || this.max < selected;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.allowedCancel = prompt.options.allowCancel;
      this.blocked = prompt.options.blocked;
      this.min = prompt.options.min;
      this.max = prompt.options.max;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.updateIsInvalid();
    }
  }

}
