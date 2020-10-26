import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";


export class Accelgor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shelmet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ ];

  public attacks = [{
    name: 'Hammer In',
    cost: [ CardType.GRASS ],
    damage: 20,
    text: ''
  }, {
    name: 'Deck and Cover',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 50,
    text: 'The Defending Pokemon is now Paralyzed and Poisoned. Shuffle this ' +
      'Pokemon and all cards attached to it into your deck.'
  }];

  public set: string = 'BW2';

  public name: string = 'Accelgor';

  public fullName: string = 'Accelgor DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const specialConditionEffect = new AddSpecialConditionsEffect(
        effect, [ SpecialCondition.PARALYZED, SpecialCondition.POISONED ]
      );
      store.reduceEffect(state, specialConditionEffect);

      player.active.moveTo(player.deck);
      player.active.clearEffects();

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    return state;
  }

}
