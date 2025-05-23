import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Poochyena3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Shadow Bind',
      cost: [CardType.DARK],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Poochyena';

  public fullName: string = 'Poochyena RS-3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
