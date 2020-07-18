import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GameState, ChoosePokemonPrompt } from 'ptcg-server';

import { GameService } from 'src/app/api/services/game.service';
import { ChoosePokemonsPaneComponent, SelectionRow, SelectionItem } from '../choose-pokemons-pane/choose-pokemons-pane.component';

@Component({
  selector: 'ptcg-prompt-choose-pokemon',
  templateUrl: './prompt-choose-pokemon.component.html',
  styleUrls: ['./prompt-choose-pokemon.component.scss']
})
export class PromptChoosePokemonComponent implements OnInit, OnChanges {

  @Input() prompt: ChoosePokemonPrompt;
  @Input() gameState: GameState;

  public rows: SelectionRow[] = [];
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;

  private count = 0;

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit() {
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    const result = ChoosePokemonsPaneComponent.buildTargets(this.rows);
    this.gameService.resolvePrompt(gameId, id, result);
  }

  public onCardClick(item: SelectionItem) {
    // If we are selecting only one card, unselect all first
    if (this.count === 1) {
      this.rows.forEach(row => row.items.forEach(i => i.selected = false));
    }

    item.selected = !item.selected;
    this.updateIsInvalid();
  }

  private updateIsInvalid() {
    let selected = 0;
    this.rows.forEach(r => r.items.forEach(i => selected += i.selected ? 1 : 0));
    this.isInvalid = selected !== this.count;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState) {
      const state = this.gameState.state;
      const prompt = this.prompt;

      this.rows = ChoosePokemonsPaneComponent.buildSelectionRows(
        state, prompt.playerId, prompt.playerType, prompt.slots);

      this.allowedCancel = prompt.options.allowCancel;
      this.count = prompt.options.count;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.updateIsInvalid();
    }
  }

}
