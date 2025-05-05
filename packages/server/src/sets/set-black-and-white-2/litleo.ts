import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';

export class Litleo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Combustion',
    cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
    damage: 60,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Litleo';

  public fullName: string = 'Litleo FLF';

}
