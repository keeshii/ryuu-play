import { Attack } from "../card/pokemon-types";
import { AttackEffect } from "./game-effects";
import { Card } from "../card/card";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";
import { SpecialCondition } from "../card/card-types";

export enum AttackEffects {
  APPLY_WEAKNESS_EFFECT = 'APPLY_WEAKNESS_EFFECT',
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT = 'DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT',
  DEAL_DAMAGE_COMPLETE_EFFECT = 'DEAL_DAMAGE_COMPLETE_EFFECT',
  DISCARD_CARD_EFFECT = 'DISCARD_CARD_EFFECT',
  ADD_MARKER_EFFECT = 'ADD_MARKER_EFFECT',
  ADD_SPECIAL_CONDITIONS_EFFECT = 'ADD_SPECIAL_CONDITIONS_EFFECT'
}

export abstract class AbstractAttackEffect {
  public attackEffect: AttackEffect;
  public attack: Attack;
  public player: Player;
  public opponent: Player;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(base: AttackEffect) {
    this.attackEffect = base;
    this.player = base.player;
    this.opponent = base.opponent;
    this.attack = base.attack;
    this.source = base.player.active;
    this.target = base.opponent.active;
  }
}

export class ApplyWeaknessEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.APPLY_WEAKNESS_EFFECT;
  public preventDefault = false;
  public damage: number;
  public ignoreResistance = false;
  public ignoreWeakness = false;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class DealDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class PutDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_AFTER_WEAKNESS_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class AfterDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_COMPLETE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class DiscardCardsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_CARD_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(base: AttackEffect, energyCards: Card[]) {
    super(base);
    this.cards = energyCards;
  }
}

export class AddMarkerEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public markerName: string;
  public markerSource: Card;

  constructor(base: AttackEffect, markerName: string, markerSource: Card) {
    super(base);
    this.markerName = markerName;
    this.markerSource = markerSource;
  }
}

export class AddSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
  public preventDefault = false;
  public poisonDamage?: number;
  public specialConditions: SpecialCondition[];

  constructor(base: AttackEffect, specialConditions: SpecialCondition[]) {
    super(base);
    this.specialConditions = specialConditions;
  }
}

export class RemoveSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
  public preventDefault = false;
  public specialConditions: SpecialCondition[];

  constructor(base: AttackEffect, specialConditions: SpecialCondition[] | undefined) {
    super(base);
    if (specialConditions === undefined) {
      specialConditions = [
        SpecialCondition.PARALYZED,
        SpecialCondition.CONFUSED,
        SpecialCondition.ASLEEP,
        SpecialCondition.POISONED,
        SpecialCondition.BURNED
      ];
    }
    this.specialConditions = specialConditions;
  }
}

export class HealTargetEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}
