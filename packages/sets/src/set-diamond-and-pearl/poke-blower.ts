import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ConfirmPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';
import { PlayerType, SlotType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';

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
      GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE
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
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
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
    return c.name === name && c !== effect.trainerCard;
  });
  if (second !== undefined) {
    player.hand.moveCardTo(second, player.discard);
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), targets => {
    if (!targets || targets.length === 0) {
      return;
    }
    opponent.switchPokemon(targets[0]);
  });
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
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
