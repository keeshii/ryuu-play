import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Pika Bolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu SS';

}
