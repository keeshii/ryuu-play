import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
export class PromptAttachEnergyComponent implements OnInit, OnChanges {

  @Input() prompt: AttachEnergyPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public cardList: CardList;
  public filter: FilterType;
  public isInvalid = false;
  public results: AttachEnergyResult[] = [];
  private options: Partial<AttachEnergyOptions> = {};
  private initialCards: Card[];

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
    const results = this.results.map(r => ({
      to: r.to.target,
      index: this.initialCards.indexOf(r.card)
    }));
    this.gameService.resolvePrompt(gameId, id, results);
  }

  ngOnInit() {
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
    const index = this.cardList.cards.indexOf(card);
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

  public reset() {
    this.results.forEach(r => {
      const item = r.to;
      item.cardList = Object.assign(new PokemonCardList(), item.cardList);
      item.cardList.cards = item.cardList.cards.filter(c => c !== r.card);
    });
    this.cardList.cards = [ ...this.initialCards ];
    this.results = [];
    this.updateIsInvalid(this.results);
  }

  private moveCard(to: PokemonItem, card: Card) {
    this.cardList.cards = [...this.cardList.cards];

    to.cardList = Object.assign(new PokemonCardList(), to.cardList);
    to.cardList.cards = [...to.cardList.cards];

    const index = this.cardList.cards.indexOf(card);
    this.cardList.cards.splice(index, 1);
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
    if (this.prompt && this.gameState) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.allowedCancel = prompt.options.allowCancel;
      this.cardList = prompt.cardList;
      this.initialCards = prompt.cardList.cards;
      this.filter = prompt.filter;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.results = [];
      this.options = prompt.options;
      this.updateIsInvalid(this.results);
    }
  }

}
