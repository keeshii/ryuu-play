import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 60;

  public weakness = [
    {
      type: CardType.WATER,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Tackle', cost: [CardType.FIRE], damage: '10', text: '' },
    {
      name: 'Rollout',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Tepig';

  public fullName: string = 'Tepig BW';
}
