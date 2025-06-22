import {
  CardType,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 30;

  public powers = [
    {
      name: 'Kabuto Armor',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack (even your own) does damage to Kabuto (after applying Weakness and Resistance), that ' +
        'attack does half the damage to Kabuto (rounded down to the nearest 10). (Any other effects of attacks ' +
        'still happen.) This power stops working while Kabuto is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Kabuto';

  public fullName: string = 'Kabuto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const target = effect.target;

      if (target.specialConditions.includes(SpecialCondition.ASLEEP)
        || target.specialConditions.includes(SpecialCondition.CONFUSED)
        || target.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage = Math.floor(effect.damage / 20) * 10;
      return state;
    }

    return state;
  }
}
