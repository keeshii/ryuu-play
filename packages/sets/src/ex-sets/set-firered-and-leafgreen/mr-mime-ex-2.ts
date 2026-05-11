import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutCountersEffect,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class MrMimeEx2 extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Magic Evens',
      powerType: PowerType.POKEBODY,
      text:
        'If Mr. Mime ex would be damaged by an attack, prevent that attack\'s damage done to Mr. Mime ex if that ' +
        'damage is 20, 40, 60, 80, 100, 120, 140, 160, or 180.'
    },
  ];

  public attacks = [
    {
      name: 'Breakdown',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text:
        'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
    },
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Mr. Mime ex';

  public fullName: string = 'Mr. Mime ex RG-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const target = effect.target;

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

      if (effect.damage % 20 === 0 && effect.damage >= 20 && effect.damage <= 180) {
        effect.preventDefault = true;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const putCountersEffect = new PutCountersEffect(effect, opponent.hand.cards.length * 10);
      store.reduceEffect(state, putCountersEffect);
    }

    return state;
  }
}
