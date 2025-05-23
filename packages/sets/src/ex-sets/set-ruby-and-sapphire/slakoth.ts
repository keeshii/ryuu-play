import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Claw',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If tails, this attack does nothing.',
    },
    {
      name: 'Slack Off',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Remove all damage counters from Slakoth. Slakoth can\'t attack during your next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Slakoth';

  public fullName: string = 'Slakoth RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
