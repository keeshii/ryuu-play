import { Attack } from "../card/pokemon-types";
import { Card } from "../card/card";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";

export enum AttackEffects {
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT = 'DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT',
  DISCARD_CARD_EFFECT = 'DISCARD_CARD_EFFECT',
  ADD_MARKER_EFFECT = 'ADD_MARKER_EFFECT'
}

export abstract class AbstractAttackEffect {
  public player: Player;
  public attack: Attack;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(player: Player, attack: Attack, target: PokemonCardList,
    source: PokemonCardList) {
    this.player = player;
    this.attack = attack;
    this.target = target;
    this.source = source;
  }
}

export class DealDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(player: Player, damage: number, attack: Attack,
    target: PokemonCardList, source: PokemonCardList) {
    super(player, attack, target, source);
    this.damage = damage;
  }
}

export class DealDamageAfterWeaknessEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(player: Player, damage: number, attack: Attack,
    target: PokemonCardList, source: PokemonCardList) {
    super(player, attack, target, source);
    this.damage = damage;
  }
}

export class DiscardCardsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_CARD_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(player: Player, energyCards: Card[], attack: Attack,
    target: PokemonCardList, source: PokemonCardList) {
    super(player, attack, target, source);
    this.cards = energyCards;
  }
}

export class AddMarkerEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public markerName: string;
  public markerSource: Card;

  constructor(player: Player, markerName: string, markerSource: Card,
    attack: Attack, target: PokemonCardList, source: PokemonCardList,  ) {
    super(player, attack, target, source);
    this.markerName = markerName;
    this.markerSource = markerSource;
  }
}

export class HealTargetEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(player: Player, damage: number, attack: Attack,
    target: PokemonCardList, source: PokemonCardList,  ) {
    super(player, attack, target, source);
    this.damage = damage;
  }
}
