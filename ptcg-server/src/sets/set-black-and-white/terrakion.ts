import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { AttackEffect, KnockOutEffect } from "../../game/store/effects/game-effects";
import { StateUtils } from "../../game/store/state-utils";

export class Terrakion extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{
    type: CardType.GRASS
  }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Retaliate',
    cost: [ CardType.FIGHTING, CardType.COLORLESS ],
    damage: 30,
    text:
      'If any of your Pokemon were Knocked Out by damage from an opponent\'s ' +
      'attack during his or her last turn, this attack does 60 more damage.'
  }, {
    name: 'Land Crush',
    cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
    damage: 90,
    text: ''
  }];

  public set: string = 'BW';

  public name: string = 'Terrakion';

  public fullName: string = 'Terrakion NV';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 60;
      }

      return state;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.RETALIATE_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    return state;
  }

}
