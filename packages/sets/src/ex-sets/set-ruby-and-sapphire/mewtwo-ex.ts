import { AttackEffect, CardTag, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class MewtwoEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public attacks = [
    {
      name: 'Energy Absorption',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Attach up to 2 Energy cards from your discard pile to Mewtwo ex.',
    },
    {
      name: 'Psyburn',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '60',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Mewtwo ex';

  public fullName: string = 'Mewtwo ex RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
