import {
  AfterDamageEffect,
  AttackEffect,
  CardType,
  Effect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metapod';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending ' +
        'Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mega Drain',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '40',
      text:
        'Remove a number of damage counters from Butterfree equal to half the damage done to the Defending Pokémon ' +
        '(after applying Weakness and Resistance) (rounded up to the nearest 10).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Butterfree';

  public fullName: string = 'Butterfree JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentSwichesDamageFirst = commonAttacks.opponentSwichesDamageFirst(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      opponentSwichesDamageFirst.use(effect);
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const damage = Math.ceil(effect.damage / 20) * 10;
      const healEffect = new HealTargetEffect(effect.attackEffect, damage);
      healEffect.target = player.active;
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
