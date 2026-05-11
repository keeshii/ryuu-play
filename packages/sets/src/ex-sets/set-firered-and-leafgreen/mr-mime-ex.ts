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

export class MrMimeEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Magic Odds',
      powerType: PowerType.POKEBODY,
      text:
        'If Mr. Mime ex would be damaged by an attack, prevent that attack\'s damage done to Mr. Mime ex if that ' +
        'damage is 10, 30, 50, 70, 90, 110, 130, 150, or 170.'
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

  public fullName: string = 'Mr. Mime ex RG';

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

      if (effect.damage % 20 === 10 && effect.damage >= 10 && effect.damage <= 170) {
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
