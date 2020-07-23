import { CardTarget, PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { CardMessage } from "../card-message";
import { GameError, GameMessage } from "../../game/game-error";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardTag } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Create list of non - Pokemon SP slots
  const blocked: CardTarget[] = [];
  let hasPokemonSp = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    const isPokemonSp = card.tags.includes(CardTag.POKEMON_SP);
    hasPokemonSp = hasPokemonSp || isPokemonSp;
    if (!isPokemonSp) {
      blocked.push(target);
    }
  });

  if (!hasPokemonSp) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_SP_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { count: 1, allowCancel: true, blocked }
  ), targets => {
    if (targets && targets.length > 0) {
      // Discard trainer only when user selected a Pokemon
      player.hand.moveCardTo(effect.trainerCard, player.discard);

      targets[0].moveTo(player.hand);
      targets[0].damage = 0;
      targets[0].clearEffects();
    }
    next();
  });

  return state;
}

export class PokeTurn extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Turn Up';

  public fullName: string = 'Poke Turn PL';

  public text: string =
    'Return 1 of your Pokemon SP and all cards attached to it to your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
