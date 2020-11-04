import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ConfirmPrompt } from "../../game/store/prompts/confirm-prompt";
import { GameMessage } from "../../game/game-message";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { StateUtils } from "../../game/store/state-utils";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const name = effect.trainerCard.name;

  const count = player.hand.cards.reduce((sum, c) => {
    return sum + (c.name === name ? 1 : 0);
  }, 0);

  // Don't allow to play both blowers,
  // when opponen has an empty bench
  const benchCount = opponent.bench.reduce((sum, b) => {
    return sum + (b.cards.length > 0 ? 1 : 0);
  }, 0);

  let playTwoCards = false;

  if (benchCount > 0 && count >= 2) {
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.PLAY_BOTH_CARDS_AT_ONCE
    ), result => {
      playTwoCards = result;
      next();
    });
  }

  if (playTwoCards === false) {
    let coinFlip = false;
    yield store.prompt(state, new CoinFlipPrompt(
      player.id,
      GameMessage.COIN_FLIP
    ), result => {
      coinFlip = result;
      next();
    });

    if (coinFlip === false) {
      return state;
    }

    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_ONE_POKEMON,
      PlayerType.TOP_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ],
      { allowCancel: false }
    ), targets => {
      if (targets && targets.length > 0) {
        targets[0].damage += 10;
      }
      next();
    });

    return state;
  }

  // Discard second Poke-Blower +
  const second = player.hand.cards.find(c => {
    return c.name === name && c !== effect.trainerCard
  });
  if (second !== undefined) {
    player.hand.moveCardTo(second, player.discard);
  }

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_ONE_POKEMON,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), targets => {
    if (!targets || targets.length === 0) {
      return;
    }
    opponent.switchPokemon(targets[0]);
    next();
  });

  return state;
}

export class PokeBlower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Blower +';

  public fullName: string = 'Poke Blower SF';

  public text: string =
    'You may play 2 Poke Blower + at the same time. If you play 1 ' +
    'Poke Blower +, flip a coin. If heads, put 1 damage counter on 1 of your ' +
    'opponent\'s Pokemon. If you play 2 Poke Blower +, choose 1 of your ' +
    'opponent\'s Benched Pokemon and switch it with 1 of your opponent\'s ' +
    'Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
