import { Component, Input, OnChanges } from '@angular/core';
import { Card, AttachEnergyPrompt, FilterType, CardList, AttachEnergyOptions,
  PokemonCardList } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

interface AttachEnergyResult {
  to: PokemonItem;
  card: Card;
}

@Component({
  selector: 'ptcg-prompt-attach-energy',
  templateUrl: './prompt-attach-energy.component.html',
  styleUrls: ['./prompt-attach-energy.component.scss']
})
export class PromptAttachEnergyComponent implements OnChanges {

  @Input() prompt: AttachEnergyPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public cardListCards: Card[];
  public filter: FilterType;
  public blocked: number[];
  public isInvalid = false;
  public results: AttachEnergyResult[] = [];
  private options: Partial<AttachEnergyOptions> = {};
  private initialCards: Card[];

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
      to: r.to.target,
      index: this.initialCards.indexOf(r.card)
    }));
    this.gameService.resolvePrompt(gameId, id, results);
  }

  public onCardDrop([item, card]: [PokemonItem, Card]) {
    if (this.pokemonData.matchesTarget(item, this.options.blockedTo)) {
      return;
    }
    if (this.options.sameTarget && !this.results.every(r => r.to === item)) {
      return;
    }
    if (this.options.differentTargets && this.results.some(r => r.to === item)) {
      return;
    }
    const index = this.cardListCards.indexOf(card);
    if (index === -1) {
      return;
    }
    const result: AttachEnergyResult = {
      to: item,
      card
    };
    this.moveCard(result.to, card);
    this.results.push(result);
    this.updateIsInvalid(this.results);
  }

  public onChange(result: number[]) {
    // Don't update when card dropped on the same spot and order didn't change
    if (result.every((item, index) => item === index)) {
      return;
    }
    const cards = this.cardListCards;
    this.cardListCards = result.map(index => cards[index]);
  }

  public reset() {
    this.results.forEach(r => {
      const item = r.to;
      item.cardList = Object.assign(new PokemonCardList(), item.cardList);
      item.cardList.cards = item.cardList.cards.filter(c => c !== r.card);
    });
    this.cardListCards = [ ...this.initialCards ];
    this.results = [];
    this.updateIsInvalid(this.results);
  }

  private moveCard(to: PokemonItem, card: Card) {
    this.cardListCards = [...this.cardListCards];

    to.cardList = Object.assign(new PokemonCardList(), to.cardList);
    to.cardList.cards = [...to.cardList.cards];

    const index = this.cardListCards.indexOf(card);
    this.cardListCards.splice(index, 1);
    to.cardList.cards.push(card);
  }

  private updateIsInvalid(results: AttachEnergyResult[]) {
    let isInvalid = false;
    if (this.options.min > results.length || this.options.max < results.length) {
      isInvalid = true;
    }
    this.isInvalid = isInvalid;
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
      this.cardListCards = prompt.cardList.cards;
      this.initialCards = prompt.cardList.cards;
      this.filter = prompt.filter;
      this.message = prompt.message;
      this.blocked = prompt.options.blocked;
      this.promptId = prompt.id;
      this.results = [];
      this.options = prompt.options;
      this.updateIsInvalid(this.results);
    }
  }

}
