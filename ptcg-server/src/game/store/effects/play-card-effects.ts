import { Effect } from "./effect";
import { EnergyCard } from "../card/energy-card";
import { Player } from "../state/player";
import { PokemonCard } from "../card/pokemon-card";
import { PokemonCardList } from "../state/pokemon-card-list";

export enum PlayCardEffects {
  ATTACH_ENERGY_EFFECT = 'ATTACH_ENERGY_EFFECT',
  PLAY_BASIC_POKEMON_EFFECT = 'PLAY_BASIC_POKEMON_EFFECT'
}

export class AttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ATTACH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public energyCard: EnergyCard;
  public target: PokemonCardList;

  constructor(player: Player, energyCard: EnergyCard, target: PokemonCardList) {
    this.player = player;
    this.energyCard = energyCard;
    this.target = target;
  }
}

export class PlayPokemonEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonCardList;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
  }
}
