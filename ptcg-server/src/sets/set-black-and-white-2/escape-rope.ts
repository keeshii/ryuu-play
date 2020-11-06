import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { PlayerType, SlotType, GameError, GameMessage, PokemonCardList, StateUtils } from "../../game";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const playerHasBench = player.bench.some(b => b.cards.length > 0);
  const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!playerHasBench && !opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let targets: PokemonCardList[] = [];
  if (opponentHasBench) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      opponent.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.BENCH ],
      { allowCancel: false }
    ), results => {
      targets = results || [];
      next();
    });

    if (targets.length > 0) {
      opponent.switchPokemon(targets[0]);
    }
  }

  if (playerHasBench) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.BENCH ],
      { allowCancel: false }
    ), results => {
      targets = results || [];
      next();
    });

    if (targets.length > 0) {
      player.switchPokemon(targets[0]);
    }
  }

  return state;
}

export class EscapeRope extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Escape Rope';

  public fullName: string = 'Escape Rope PLS';

  public text: string =
    'Each player switches his or her Active Pokemon with 1 of his or her ' +
    'Benched Pokemon. (Your opponent switches first. If a player does not ' +
    'have a Benched Pokemon, he or she doesn\'t switch Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
