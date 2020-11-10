import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { GameMessage } from "../../game/game-message";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";
import { PlayerType } from "../../game/store/actions/play-card-action";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";


export class Wartortle extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Squirtle';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Withdraw',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokemon ' +
      'by attacks during your opponent\'s next turn.'
  }, {
    name: 'Waterfall',
    cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
    damage: 60,
    text: ''

  }];

  public set: string = 'BW3';

  public name: string = 'Wartortle';

  public fullName: string = 'Wartortle BC';

  public readonly CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';

  public readonly WITHDRAW_MARKER = 'WITHDRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.WITHDRAW_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_WITHDRAW_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.WITHDRAW_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_WITHDRAW_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.WITHDRAW_MARKER, this);
      });
    }

    return state;
  }

}
