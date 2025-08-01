import {
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kyurem extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Outrage',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 10 more damage for each damage counter on this Pokémon.',
    },
    {
      name: 'Glaciate',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '',
      text:
        'This attack does 30 damage to each of your opponent\'s Pokémon ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Kyurem';

  public fullName: string = 'Kyurem NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.pokemons.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 30);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}
