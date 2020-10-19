import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";
import { StateUtils } from "../../game/store/state-utils";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";


export class Duskull extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'The Defending Pokemon is now Confused.'
  }];

  public set: string = 'BW2';

  public name: string = 'Duskull';

  public fullName: string = 'Duskull BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
        }
      });
    }
    return state;
  }

}
