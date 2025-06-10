import {
  AddSpecialConditionsEffect,
  AfterDamageEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Treecko';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Poison Breath',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.',
    },
    {
      name: 'Swift',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other ' +
        'effects on the Defending Pokémon.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Grovyle';

  public fullName: string = 'Grovyle RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const damage = 30;

      effect.damage = 0;

      opponent.active.damage += damage;
      const afterDamage = new AfterDamageEffect(effect, damage);
      state = store.reduceEffect(state, afterDamage);
    }

    return state;
  }
}
