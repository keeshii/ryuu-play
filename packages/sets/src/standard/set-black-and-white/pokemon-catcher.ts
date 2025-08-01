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
  TrainerType,
} from '@ptcg/common';

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

export class PokemonCatcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Pokemon Catcher';

  public fullName: string = 'Pokemon Catcher SSH';

  public text: string =
    'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
