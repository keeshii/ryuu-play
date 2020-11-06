import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { GameMessage } from "../../game/game-message";


export class Skrelp extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Spit Poison',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
      'is now Poisoned.'
  }];

  public set: string = 'BW2';

  public name: string = 'Skrelp';

  public fullName: string = 'Skrelp FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }
    return state;
  }

}
