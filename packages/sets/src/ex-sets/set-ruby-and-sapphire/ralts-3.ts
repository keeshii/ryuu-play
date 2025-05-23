import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Ralts3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Link Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '40',
      text:
        'If Ralts and the Defending Pokémon have a different amount of Energy attached to them, this attack\'s base ' +
        'damage is 10 instead of 40.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Ralts';

  public fullName: string = 'Ralts RS-3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
