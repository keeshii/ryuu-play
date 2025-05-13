import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';

export class Phanpy extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Tackle',
    cost: [ CardType.FIGHTING ],
    damage: '10',
    text: ''
  }, {
    name: 'Rollout',
    cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
    damage: '50',
    text: ''
  }];

  public set: string = 'BW4';

  public name: string = 'Phanpy';

  public fullName: string = 'Phanpy PLS';

}
