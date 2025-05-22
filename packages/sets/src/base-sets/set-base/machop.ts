import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Low Kick',
      cost: [CardType.FIGHTING],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Machop';

  public fullName: string = 'Machop BS';

}
