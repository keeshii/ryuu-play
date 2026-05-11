import {
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
} from '@ptcg/common';

import { CommonTrainer } from '../common.interfaces';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH], {
      allowCancel: false,
    }),
    result => {
      const cardList = result[0];
      opponent.switchPokemon(cardList);
    }
  );
}


export const pokemonCatcher: CommonTrainer = function(
  self: TrainerCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    playCard: trainerEffect => {
      const generator = playCard(() => generator.next(), store, state, trainerEffect);
      return generator.next().value;
    }
  };
};
