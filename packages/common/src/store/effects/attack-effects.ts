import { Attack } from '../card/pokemon-types';
import { AttackEffect } from './game-effects';
import { Card } from '../card/card';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { SpecialCondition } from '../card/card-types';
import { CardList } from '../state/card-list';

export enum AttackEffects {
  APPLY_WEAKNESS_EFFECT = 'APPLY_WEAKNESS_EFFECT',
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  PUT_DAMAGE_EFFECT = 'PUT_DAMAGE_EFFECT',
  AFTER_DAMAGE_EFFECT = 'AFTER_DAMAGE_EFFECT',
  PUT_COUNTERS_EFFECT = 'PUT_COUNTERS_EFFECT',
  DISCARD_CARD_EFFECT = 'DISCARD_CARD_EFFECT',
  MOVE_CARD_EFFECT = 'MOVE_CARD_EFFECT',
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
  readonly type: string = AttackEffects.PUT_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class AfterDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.AFTER_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class PutCountersEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.PUT_COUNTERS_EFFECT;
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

  constructor(base: AttackEffect, cards: Card[]) {
    super(base);
    this.cards = cards.slice();
  }
}

export class MoveCardsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.MOVE_CARD_EFFECT;
  public preventDefault = false;
  public cards: Card[];
  public destination: CardList;

  constructor(base: AttackEffect, cards: Card[], destination: CardList) {
    super(base);
    this.cards = cards.slice();
    this.destination = destination;
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
