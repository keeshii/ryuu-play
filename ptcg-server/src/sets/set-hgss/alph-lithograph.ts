import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ShowCardsPrompt } from "../../game/store/prompts/show-cards-prompt";
import { GameMessage } from "../../game/game-message";
import { Card } from "../../game/store/card/card";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const prizes: Card[] = [];
  const wasSecret: boolean[] = [];

  player.prizes.forEach(p => {
    wasSecret.push(p.isSecret);
    p.isSecret = false;
    p.cards.forEach(c => prizes.push(c))
  });

  yield store.prompt(state, new ShowCardsPrompt(
    player.id,
    GameMessage.CARDS_SHOWED_BY_EFFECT,
    prizes,
  ), () => { next(); });

  player.prizes.forEach((p, index) => {
    p.isSecret = wasSecret[index];
  });

  return state;
}

export class AlphLithograph extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Alph Lithograph';

  public fullName: string = 'Alph Lithograph TRM';

  public text: string =
    'Look at all of your face down prize cards!';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
