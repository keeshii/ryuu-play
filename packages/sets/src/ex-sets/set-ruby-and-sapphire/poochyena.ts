import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Poochyena extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Poochyena';

  public fullName: string = 'Poochyena RS';
}
