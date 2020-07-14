import { CardMessage } from "../card-message";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { PlayerType, SlotType, CoinFlipPrompt } from "../../game";

function* playCard(next: Function, store: StoreLike, state: State, effect: PlayTrainerEffect): IterableIterator<State> {
  const player = effect.player;

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { count: 1, allowCancel: false }
  ), result => {
    const cardList = result[0];
    cardList.clearEffects();
    cardList.moveTo(player.hand);
    next();
  });

  return state;
}

export class SuperScoopUp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Super Scoop Up';

  public fullName: string = 'Super Scoop Up CES';

  public text: string =
    'Flip a coin. If heads, put 1 of your Pokemon ' +
    'and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
