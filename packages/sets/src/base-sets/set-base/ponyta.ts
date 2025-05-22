import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Smash Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Flame Tail',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Ponyta';

  public fullName: string = 'Ponyta BS';

}
