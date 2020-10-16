import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { KnockOutEffect } from "../../game/store/effects/game-effects";
import { StateUtils } from "../../game/store/state-utils";

function* cardEffect(next: Function, store: StoreLike, state: State,
  effect: KnockOutEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Do not activate between turns, or when it's not opponents turn.
  if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
    return state;
  }

  const target = effect.target;
  const cards = target.getPokemons();

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  player.discard.moveCardsTo(cards, player.hand);
}

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
      let generator: IterableIterator<State>;
      generator = cardEffect(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
