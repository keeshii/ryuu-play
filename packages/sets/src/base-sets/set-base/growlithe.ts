import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Growlithe';

  public fullName: string = 'Growlithe BS';

}
