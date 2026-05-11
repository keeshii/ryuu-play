import {
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
} from '@ptcg/common';

import { CommonTrainer } from '../common.interfaces';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

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
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false }
    ),
    result => {
      const cardList = result[0];
      cardList.moveTo(player.hand);
      cardList.clearEffects();
    }
  );
}


export const superScoopUp: CommonTrainer = function(
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
