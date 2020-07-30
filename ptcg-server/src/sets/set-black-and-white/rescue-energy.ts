import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { KnockOutEffect } from "../../game/store/effects/game-effects";
import { StateUtils } from "../../game/store/state-utils";
import { PokemonCard } from "../../game/store/card/pokemon-card";

export class RescueEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rescue Energy';

  public fullName = 'Rescue Energy TRM';

  public text =
    'Rescue Energy provides C Energy. If the Pokemon this card is attached ' +
    'to is Knocked Out by damage from an attack, put that Pokemon back into ' +
    'your hand. (Discard all cards attached to that Pokemon.)'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const target = effect.target;
      const tool = target.tool;
      const cards = target.cards.filter(c => c instanceof PokemonCard && c !== tool);
      return store.waitPrompt(state, () => {
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  }

}
