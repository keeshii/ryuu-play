import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.WATER],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Goldeen';

  public fullName: string = 'Goldeen JU';

}
