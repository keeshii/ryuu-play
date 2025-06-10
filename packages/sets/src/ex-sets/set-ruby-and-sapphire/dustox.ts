import {
  AbstractAttackEffect,
  AddSpecialConditionsEffect,
  AttackEffect,
  AttackEffects,
  CardType,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dustox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Cascoon';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public powers = [
    {
      name: 'Protective Dust',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, except damage, done to Dustox by the Attacking Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '',
      text:
        'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between ' +
        'turns.',
    },
    {
      name: 'Gust',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Dustox';

  public fullName: string = 'Dustox RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;

      // pokemon is evolved
      if (effect.target.getPokemonCard() !== this) {
        return state;
      }

      // Not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Do not block effects that inflict damage
      const damageEffects: string[] = [
        AttackEffects.APPLY_WEAKNESS_EFFECT,
        AttackEffects.DEAL_DAMAGE_EFFECT,
        AttackEffects.PUT_DAMAGE_EFFECT,
        AttackEffects.AFTER_DAMAGE_EFFECT,
        // AttackEffects.PUT_COUNTERS_EFFECT, <-- This is not damage
      ];
      if (damageEffects.includes(effect.type)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
