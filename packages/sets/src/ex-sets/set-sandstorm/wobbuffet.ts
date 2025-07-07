import {
  AbstractAttackEffect,
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Safeguard',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, including damage, done to Wobbuffet by your opponent\'s Pokémon-ex.'
    },
  ];

  public attacks = [
    {
      name: 'Flip Over',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Wobbuffet does 10 damage to itself, and don\'t apply Weakness and Resistance to this damage.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wobbuffet';

  public fullName: string = 'Wobbuffet SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.pokemons.cards.includes(this)) {
      const target = effect.target;
      const targetPlayer = StateUtils.findOwner(state, target);

      if (target.getPokemonCard() !== this || effect.source === effect.target) {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      if (!pokemonCard || !pokemonCard.tags.includes(CardTag.POKEMON_EX)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(targetPlayer, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new PutDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
