import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PutDamagePrompt, CardTarget, DamageMap, PokemonCardList } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';


@Component({
  selector: 'ptcg-prompt-put-damage',
  templateUrl: './prompt-put-damage.component.html',
  styleUrls: ['./prompt-put-damage.component.scss']
})
export class PromptPutDamageComponent implements OnInit, OnChanges {

  @Input() prompt: PutDamagePrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;
  public isRemoveDisabled = true;
  public isAddDisabled = true;
  public damage = 0;

  private initialDamage = 0;
  private initialDamageMap: DamageMap[];
  private maxDamageMap: DamageMap[];
  private blocked: CardTarget[];

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
    const results = this.buildDamageMap(this.pokemonData);
    this.gameService.resolvePrompt(gameId, id, results);
  }

  ngOnInit() {
  }

  public onCardClick(item: PokemonItem) {
    if (this.pokemonData.matchesTarget(item, this.blocked)) {
      return;
    }
    this.pokemonData.unselectAll();
    item.selected = true;
    this.selectedItem = item;
    this.updateButtonDisable();
  }

  public removeDamage() {
    this.damage += 10;
    const item = this.selectedItem;
    item.cardList = Object.assign(new PokemonCardList(), item.cardList);
    item.cardList.damage -= 10;
    this.updateButtonDisable();
    this.updateIsInvalid();
  }

  public addDamage() {
    this.damage -= 10;
    const item = this.selectedItem;
    item.cardList = Object.assign(new PokemonCardList(), item.cardList);
    item.cardList.damage += 10;
    this.updateButtonDisable();
    this.updateIsInvalid();
  }

  public reset() {
    this.damage = this.initialDamage;
    const pokemonRows = this.pokemonData.getRows();
    for (const row of pokemonRows) {
      for (const item of row.items) {
        const initial = this.initialDamageMap.find(i => {
          return i.target.player === item.target.player
            && i.target.slot === item.target.slot
            && i.target.index === item.target.index;
        });
        if (initial !== undefined && initial.damage !== item.cardList.damage) {
          item.cardList = Object.assign(new PokemonCardList(), item.cardList);
          item.cardList.damage = initial.damage;
        }
      }
    }
    this.updateButtonDisable();
    this.updateIsInvalid();
  }

  private updateButtonDisable() {
    if (this.selectedItem === undefined) {
      this.isAddDisabled = true;
      this.isRemoveDisabled = true;
      return;
    }

    const target = this.selectedItem.target;
    const cardList = this.selectedItem.cardList;
    const damageMap = this.maxDamageMap.find(d => {
      return d.target.player === target.player
        && d.target.slot === target.slot
        && d.target.index === target.index;
    });
    const allowedDamage: number | undefined = damageMap && damageMap.damage;

    const initial = this.initialDamageMap.find(i => {
      return i.target.player === target.player
        && i.target.slot === target.slot
        && i.target.index === target.index;
    });

    let isAddDisabled = false;
    let isRemoveDisabled = false;

    if (initial !== undefined && cardList.damage <= initial.damage) {
      isRemoveDisabled = true;
    }
    if (this.damage === 0 || cardList.damage >= allowedDamage) {
      isAddDisabled = true;
    }

    this.isAddDisabled = isAddDisabled;
    this.isRemoveDisabled = isRemoveDisabled;
  }

  private buildDamageMap(pokemonData: PokemonData): DamageMap[] {
    const results: DamageMap[] = [];
    const pokemonRows = pokemonData.getRows();

    for (const row of pokemonRows) {
      for (const item of row.items) {

        const initial = this.initialDamageMap.find(i => {
          return i.target.player === item.target.player
            && i.target.slot === item.target.slot
            && i.target.index === item.target.index;
        });

        if (initial !== undefined) {
          const damage = item.cardList.damage - initial.damage;
          if (damage >= 0) {
            results.push({ target: item.target, damage });
          }
        }
      }
    }

    return results;
  }

  private updateIsInvalid() {
    let isInvalid = false;
    if (this.damage > 0) {
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
      this.blocked = prompt.options.blocked;
      this.allowedCancel = prompt.options.allowCancel;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.maxDamageMap = prompt.maxAllowedDamage;
      this.selectedItem = undefined;

      this.initialDamageMap = [];
      const pokemonRows = this.pokemonData.getRows();
      for (const row of pokemonRows) {
        for (const item of row.items) {
          if (item.cardList.cards.length > 0) {
            const damageItem = { target: item.target, damage: item.cardList.damage };
            this.initialDamageMap.push(damageItem);
          }
        }
      }

      this.initialDamage = prompt.damage;
      this.damage = prompt.damage;
      this.updateIsInvalid();
    }
  }

}
