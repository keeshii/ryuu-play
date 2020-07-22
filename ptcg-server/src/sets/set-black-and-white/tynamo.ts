import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, CoinFlipPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import {CardMessage} from "../card-message";

export class Tynamo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Thunder Wave',
      cost: [ CardType.LIGHTNING ],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Tynamo';

  public fullName: string = 'Tynamo NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.PARALYZED);
        }
      });
    }

    return state;
  }

}
