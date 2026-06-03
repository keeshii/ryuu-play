import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Speed Ball',
      cost: [CardType.LIGHTNING],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Voltorb';

  public fullName: string = 'Voltorb TR';

}
