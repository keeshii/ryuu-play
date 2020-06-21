import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { Effect, EffectTarget } from "./effect";
import { Player } from "../state/player";

export enum PlayCardEffects {
  ATTACH_ENERGY_EFFECT = 'ATTACH_ENERGY_EFFECT',
  PLAY_BASIC_POKEMON_EFFECT = 'PLAY_BASIC_POKEMON_EFFECT'
}

export class AttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ATTACH_ENERGY_EFFECT;
  public source: EffectTarget;
  public target: EffectTarget;

  constructor(player: Player, fromCardList: CardList, energyCard: Card, target: CardList) {
    this.source = { player, cardList: fromCardList, card: energyCard };
    this.target = { player, cardList: target};
  }
}

export class PlayBasicPokemon implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public source: EffectTarget;
  public target: EffectTarget;

  constructor(player: Player, fromCardList: CardList, pokemonCard: Card, benchIndex: number) {
    this.source = { player, cardList: fromCardList, card: pokemonCard };
    this.target = { player, cardList: player.bench[benchIndex] };
  }
}
