import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Goldeen';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.WATER],
      damage: '10',
      text: ''
    },
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking JU';

}
