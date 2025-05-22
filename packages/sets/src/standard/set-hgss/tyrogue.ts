import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Tyrogue extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 30;

  public retreat = [];

  public powers = [
    {
      name: 'Sweet Sleeping Face',
      powerType: PowerType.POKEBODY,
      text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue by attacks.',
    },
  ];

  public attacks = [
    {
      name: 'Mischievous Punch',
      cost: [],
      damage: '30',
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. Tyrogue is now Asleep.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Tyrogue';

  public fullName: string = 'Tyrogue HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
      specialCondition.target = player.active;
      store.reduceEffect(state, specialCondition);

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
      return state;
    }

    if (effect instanceof PutDamageEffect) {
      if (effect.target.cards.includes(this)) {
        const pokemonCard = effect.target.getPokemonCard();
        const isAsleep = effect.target.specialConditions.includes(SpecialCondition.ASLEEP);
        if (pokemonCard === this && isAsleep) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(effect.player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
          effect.preventDefault = true;
        }
      }
    }

    return state;
  }
}
