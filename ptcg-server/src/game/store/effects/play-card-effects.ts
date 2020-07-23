import { Effect } from "./effect";
import { EnergyCard } from "../card/energy-card";
import { Player } from "../state/player";
import { PokemonCard } from "../card/pokemon-card";
import { PokemonCardList } from "../state/pokemon-card-list";
import { TrainerCard } from "../card/trainer-card";
import {CardList} from "../state/card-list";

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

export class PlaySupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayStadiumEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;

  constructor(player: Player, trainerCard: TrainerCard) {
    this.player = player;
    this.trainerCard = trainerCard;
  }
}

export class AttachPokemonToolEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonCardList;

  constructor(player: Player, trainerCard: TrainerCard, target: PokemonCardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayItemEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class TrainerEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}
