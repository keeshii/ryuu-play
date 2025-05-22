import {
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  SpecialCondition,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const active = opponent.active;

  const isPoisoned = active.specialConditions.includes(SpecialCondition.POISONED);
  const isAsleep = active.specialConditions.includes(SpecialCondition.ASLEEP);

  if (isPoisoned && isAsleep) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  active.addSpecialCondition(SpecialCondition.POISONED);

  let coinResult: boolean = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  active.addSpecialCondition(SpecialCondition.ASLEEP);
  return state;
}

export class HypnotoxicLaser extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Hypnotoxic Laser';

  public fullName: string = 'Hypnotoxic Laser PS';

  public text: string =
    'Your opponent\'s Active Pokémon is now Poisoned. Flip a coin. ' +
    'If heads, your opponent\'s Active Pokémon is also Asleep.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
