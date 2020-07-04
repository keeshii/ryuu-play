import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerType } from "../../game/store/card/pokemon-types";

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public resistance = [{
    type: CardType.COLORLESS,
    value: -20
  }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Overeager',
    powerType: PowerType.POKEBODY,
    text: 'If Sableye is your Active Pokemon at the beginning of the game, ' +
      'you go first. (If each player\'s Active Pokemon has the Overreager ' +
      'Poke-Body, this power does nothing.)'
  }];

  public attacks = [
    {
      name: 'Impersonate',
      cost: [],
      damage: 0,
      text: 'Search your deck for a Supporter card and discard it. ' +
        'Shuffle your deck afterward. ' +
        'Then, use the effect of that card as the effect of this attack.'
    },
    {
      name: 'Overconfident',
      cost: [CardType.DARK],
      damage: 10,
      text: 'If the Defending Pokemon has fewer remaining HP than Sableye, ' +
        'this attack\'s base damage is 40.'
    }
  ];

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
