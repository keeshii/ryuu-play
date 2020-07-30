import { CardMessage } from "../card-message";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { PlayerType, SlotType, GameError, GameMessage, PokemonCardList } from "../../game";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: true }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  player.switchPokemon(targets[0]);
  return state;
}

export class Switch extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Switch';

  public fullName: string = 'Switch SSH';

  public text: string =
    'Switch your Active Pokemon with 1 of your Benched Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
