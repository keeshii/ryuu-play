import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Bellsprout extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Bellsprout';

  public fullName: string = 'Bellsprout RG';

}
