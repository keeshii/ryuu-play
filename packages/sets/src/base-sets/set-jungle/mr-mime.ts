import {
  AttackEffect,
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
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 40;

  public powers = [
    {
      name: 'Invisible Wall',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack (including your own) does 30 or more damage to Mr. Mime (after applying Weakness and ' +
        'Resistance), prevent that damage. (Any other effects of attacks still happen.) This power can\'t be used if ' +
        'Mr. Mime is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Meditate',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Mr. Mime';

  public fullName: string = 'Mr. Mime JU';

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

      if (effect.damage >= 30) {
        effect.preventDefault = true;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage += opponent.active.damage;
    }

    return state;
  }
}
