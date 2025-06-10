import { Component, Input, OnChanges } from '@angular/core';
import { Card, MoveEnergyPrompt, CardTarget, FilterType, PokemonSlot, EnergyCard } from '@ptcg/common';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

interface MoveEnergyResult {
  from: PokemonItem;
  to: PokemonItem;
  card: EnergyCard;
}

@Component({
  selector: 'ptcg-prompt-move-energy',
  templateUrl: './prompt-move-energy.component.html',
  styleUrls: ['./prompt-move-energy.component.scss']
})
export class PromptMoveEnergyComponent implements OnChanges {

  @Input() prompt: MoveEnergyPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: FilterType;
  public isInvalid = false;
  public blocked: number[] = [];
  public results: MoveEnergyResult[] = [];

  private min: number;
  private max: number | undefined;

  private blockedFrom: CardTarget[];
  private blockedTo: CardTarget[];
  private blockedCardList: Card[];

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
    const results = this.results.map(r => ({
      from: r.from.target,
      to: r.to.target,
      index: this.pokemonData.getCardIndex(r.card)
    }));
    this.gameService.resolvePrompt(gameId, id, results);
  }

  public onCardClick(item: PokemonItem) {
    if (this.pokemonData.matchesTarget(item, this.blockedFrom)) {
      return;
    }
    this.pokemonData.unselectAll();
    item.selected = true;
    this.selectedItem = item;
    this.updateBlocked(item);
  }

  public onCardDrop([item, card]: [PokemonItem, EnergyCard]) {
    if (item === this.selectedItem) {
      return;
    }
    if (this.pokemonData.matchesTarget(item, this.blockedTo)) {
      return;
    }
    const index = this.selectedItem.pokemonSlot.energies.cards.indexOf(card);
    if (index === -1) {
      return;
    }
    const result: MoveEnergyResult = {
      from: this.selectedItem,
      to: item,
      card
    };
    this.moveCard(result.from, result.to, card);
    this.appendMoveResult(result);
    this.updateIsInvalid(this.results);
    this.updateBlocked(this.selectedItem);
  }

  public reset() {
    this.results.forEach(r => {
      this.moveCard(r.to, r.from, r.card);
    });
    this.results = [];
    this.updateIsInvalid(this.results);
    if (this.selectedItem !== undefined) {
      this.updateBlocked(this.selectedItem);
    }
  }

  private moveCard(from: PokemonItem, to: PokemonItem, card: EnergyCard) {
    from.pokemonSlot = Object.assign(new PokemonSlot(), from.pokemonSlot);
    from.pokemonSlot.energies.cards = [...from.pokemonSlot.energies.cards];

    to.pokemonSlot = Object.assign(new PokemonSlot(), to.pokemonSlot);
    to.pokemonSlot.energies.cards = [...to.pokemonSlot.energies.cards];

    const index = from.pokemonSlot.energies.cards.indexOf(card);
    from.pokemonSlot.energies.cards.splice(index, 1);
    to.pokemonSlot.energies.cards.push(card);
  }

  private appendMoveResult(result: MoveEnergyResult) {
    const index = this.results.findIndex(r => r.card === result.card);
    if (index === -1) {
      this.results.push(result);
      return;
    }
    const prevResult = this.results[index];
    if (prevResult.from === result.to) {
      this.results.splice(index, 1);
      return;
    }
    prevResult.to = result.to;
  }

  private updateIsInvalid(results: MoveEnergyResult[]) {
    let isInvalid = false;
    if (this.min > results.length) {
      isInvalid = true;
    }
    if (this.max !== undefined && this.max < results.length) {
      isInvalid = true;
    }
    this.isInvalid = isInvalid;
  }

  private updateBlocked(item: PokemonItem) {
    const blocked: number[] = [];
    item.pokemonSlot.energies.cards.forEach((c, index) => {
      if (this.blockedCardList.includes(c)) {
        blocked.push(index);
      }
    });
    this.blocked = blocked;
  }

  private buildBlockedCardList(
    pokemonData: PokemonData,
    blockedMap: { source: CardTarget, blocked: number[] }[]
  ): Card[] {
    const cards: Card[] = [];

    const rows = pokemonData.getRows();
    for (const row of rows) {
      for (const item of row.items) {

        const blockedItem = blockedMap.find(bm => {
          return pokemonData.matchesTarget(item, [bm.source]);
        });

        if (blockedItem !== undefined) {
          blockedItem.blocked.forEach(b => {
            cards.push(item.pokemonSlot.energies.cards[b]);
          });
        }

      }
    }

    return cards;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.blockedFrom = prompt.options.blockedFrom;
      this.blockedTo = prompt.options.blockedTo;
      this.blockedCardList = this.buildBlockedCardList(this.pokemonData, prompt.options.blockedMap);
      this.allowedCancel = prompt.options.allowCancel;
      this.filter = prompt.filter;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.selectedItem = undefined;
      this.results = [];
      this.min = prompt.options.min;
      this.max = prompt.options.max;
      this.updateIsInvalid(this.results);
    }
  }

}
