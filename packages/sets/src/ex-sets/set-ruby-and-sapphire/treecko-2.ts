import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Treecko2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Tail Slap',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Treecko';

  public fullName: string = 'Treecko RS-2';
}
