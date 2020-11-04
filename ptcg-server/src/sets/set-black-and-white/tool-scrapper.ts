import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { PlayerType, SlotType, StateUtils, CardTarget, GameError, GameMessage,
  PokemonCardList } from "../../game";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let pokemonsWithTool = 0;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.tool !== undefined) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.tool !== undefined) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });

  if (pokemonsWithTool === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(2, pokemonsWithTool);
  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.ANY,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { min: 1, max: max, allowCancel: true, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  targets.forEach(target => {
    const owner = StateUtils.findOwner(state, target);
    if (target.tool !== undefined) {
      target.moveCardTo(target.tool, owner.discard);
      target.tool = undefined;
    }
  });

  return state;
}

export class ToolScrapper extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Tool Scrapper';

  public fullName: string = 'Tool Scrapper DRX';

  public text: string =
    'Choose up to 2 Pokemon Tool cards attached to Pokemon in play (yours or ' +
    'your opponent\'s) and discard them.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
