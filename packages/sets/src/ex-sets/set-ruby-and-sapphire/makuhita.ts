import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Makuhita extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Slap Push',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Lunge Out',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Makuhita';

  public fullName: string = 'Makuhita RS';
}
