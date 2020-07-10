import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GameState, ChoosePokemonPrompt, PokemonCardList, PlayerType, SlotType,
  CardTarget, State } from 'ptcg-server';

import { GameService } from 'src/app/api/services/game.service';

interface SelectionItem {
  cardList: PokemonCardList;
  selected: boolean;
}

interface SelectionRow {
  items: SelectionItem[];
  target: CardTarget;
}

@Component({
  selector: 'ptcg-prompt-choose-pokemon',
  templateUrl: './prompt-choose-pokemon.component.html',
  styleUrls: ['./prompt-choose-pokemon.component.scss']
})
export class PromptChoosePokemonComponent implements OnInit, OnChanges {

  @Input() prompt: ChoosePokemonPrompt;
  @Input() gameState: GameState;

  public PlayerType = PlayerType;
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

    const result: CardTarget[] = [];
    this.rows.forEach(row => row.items.forEach((item, index) => {
      if (item.selected) {
        result.push({...row.target, index });
      }
    }));

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

  private buildRow(cardLists: PokemonCardList[], player: PlayerType, slot: SlotType) {
    const target = { player, slot, index: 0 };
    const items = cardLists.map(cardList => ({cardList, selected: false}));
    return { target, items };
  }

  private buildSelectionRows(state: State, prompt: ChoosePokemonPrompt) {
    const player = state.players.find(p => p.id === this.prompt.playerId);
    const opponent = state.players.find(p => p.id !== this.prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return;
    }

    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasBench = prompt.slots.includes(SlotType.BENCH);
    const hasActive = prompt.slots.includes(SlotType.ACTIVE);

    const rows: SelectionRow[] = [];
    if (hasOpponent && hasBench) {
      rows.push(this.buildRow(opponent.bench, PlayerType.TOP_PLAYER, SlotType.BENCH));
    }
    if (hasOpponent && hasActive) {
      rows.push(this.buildRow([opponent.active], PlayerType.TOP_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasActive) {
      rows.push(this.buildRow([player.active], PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasBench) {
      rows.push(this.buildRow(player.bench, PlayerType.BOTTOM_PLAYER, SlotType.BENCH));
    }

    return rows;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState) {
      const state = this.gameState.state;
      const prompt = this.prompt;

      this.rows = this.buildSelectionRows(state, prompt);
      this.allowedCancel = prompt.options.allowCancel;
      this.count = prompt.options.count;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.updateIsInvalid();
    }
  }

}
