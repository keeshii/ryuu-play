import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { PutDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Gabite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Gible';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public weakness = [{
    type: CardType.COLORLESS,
    value: 20
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Burrow',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Gabite by ' +
      'attacks during your opponent\'s next turn.'
  }, {
    name: 'Distorted Wave',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 60,
    text: 'Before doing damage, remove 2 damage counters from the Defending ' +
      'Pokemon.'
  }];

  public set: string = 'OP9';

  public name: string = 'Gabite';

  public fullName: string = 'Gabite OP9';

  public readonly CLEAR_BURROW_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';

  public readonly BURROW_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.BURROW_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_BURROW_MARKER, this);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const healTarget = new HealTargetEffect(effect, 20);
      return store.reduceEffect(state, healTarget);
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.BURROW_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_BURROW_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_BURROW_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.BURROW_MARKER, this);
      });
    }

    return state;
  }

}
