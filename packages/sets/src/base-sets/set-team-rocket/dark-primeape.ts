import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkPrimeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mankey';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public powers = [
    {
      name: 'Frenzy',
      powerType: PowerType.POKEPOWER,
      text: 'If Dark Primeape does any damage while it\'s Confused (even to itself), it does 30 more damage.'
    },
  ];

  public attacks = [
    {
      name: 'Frenzied Attack',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '40',
      text: 'Dark Primeape is now Confused (after doing damage).'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Primeape';

  public fullName: string = 'Dark Primeape TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Note: Having problem with this one. When flip for confusion fails,
    // we put damage counters, it's not "doing the damage" (for example
    // Defender is not reducing the damage, weakness is not applied, etc).
    // I think we shouldn't place 6 damage counters when confusion fails.
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.source);

      if (!effect.source.specialConditions.includes(SpecialCondition.CONFUSED)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {       
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage += 30;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      specialConditionEffect.target = effect.player.active;
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
