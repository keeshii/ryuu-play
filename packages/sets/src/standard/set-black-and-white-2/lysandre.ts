import {
  ChoosePokemonPrompt,
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
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
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

export class Lysandre extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW2';

  public name: string = 'Lysandre';

  public fullName: string = 'Lysandre FLF';

  public text: string = 'Switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
