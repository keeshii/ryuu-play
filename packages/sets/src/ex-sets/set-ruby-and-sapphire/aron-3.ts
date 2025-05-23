import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Aron3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Aron';

  public fullName: string = 'Aron RS-3';
}
