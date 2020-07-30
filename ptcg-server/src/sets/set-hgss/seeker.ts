import { CardMessage } from "../card-message";
import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { GameError, GameMessage } from "../../game/game-error";
import { Player } from "../../game/store/state/player";
import { StateUtils } from "../../game/store/state-utils";

function pickUpBenchedPokemon(next: Function, store: StoreLike, state: State, player: Player): State {
  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), selection => {
    const cardList = selection[0];
    cardList.moveTo(player.hand);
    cardList.clearEffects();
    next();
  });
}

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const playerHasBench = player.bench.some(b => b.cards.length > 0);
  const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!playerHasBench && !opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (playerHasBench) {
    yield pickUpBenchedPokemon(next, store, state, player);
  }

  if (opponentHasBench) {
    yield pickUpBenchedPokemon(next, store, state, opponent);
  }

  return state;
}

export class Seeker extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Seeker';

  public fullName: string = 'Seeker TRM';

  public text: string =
    'Each player returns 1 of his or her Benched Pokemon and all cards ' +
    'attached to it to his or her hand. (You return your Pokemon first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
