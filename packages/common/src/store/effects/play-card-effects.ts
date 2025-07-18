import { Effect } from './effect';
import { EnergyCard } from '../card/energy-card';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { PokemonSlot } from '../state/pokemon-slot';

export enum PlayCardEffects {
  ATTACH_ENERGY_EFFECT = 'ATTACH_ENERGY_EFFECT',
  PLAY_POKEMON_EFFECT = 'PLAY_POKEMON_EFFECT',
  PLAY_SUPPORTER_EFFECT = 'PLAY_SUPPORTER_EFFECT',
  PLAY_STADIUM_EFFECT = 'PLAY_STADIUM_EFFECT',
  PLAY_POKEMON_TOOL_EFFECT = 'PLAY_POKEMON_TOOL_EFFECT',
  PLAY_ITEM_EFFECT = 'PLAY_ITEM_EFFECT',
  TRAINER_EFFECT = 'TRAINER_EFFECT'
}

export class AttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ATTACH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public energyCard: EnergyCard;
  public target: PokemonSlot;

  constructor(player: Player, energyCard: EnergyCard, target: PokemonSlot) {
    this.player = player;
    this.energyCard = energyCard;
    this.target = target;
  }
}

export class PlayPokemonEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonSlot;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonSlot) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
  }
}

export class PlaySupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonSlot | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: PokemonSlot) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayStadiumEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_STADIUM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;

  constructor(player: Player, trainerCard: TrainerCard) {
    this.player = player;
    this.trainerCard = trainerCard;
  }
}

export class AttachPokemonToolEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonSlot;

  constructor(player: Player, trainerCard: TrainerCard, target: PokemonSlot) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayItemEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_ITEM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonSlot | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: PokemonSlot) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class TrainerEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonSlot | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: PokemonSlot) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}
