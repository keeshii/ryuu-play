import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  ShuffleDeckPrompt,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonCard = player.active.getPokemonCard() ;
  let cards: Card[] = [];

  if (player.deck.cards.length === 0 || !pokemonCard) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.POKEMON, evolvesFrom: pokemonCard.name },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    // Evolve Pokemon
    player.deck.moveCardsTo(cards, player.active.pokemons);
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class WallysTraining extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SS';

  public name: string = 'Wally\'s Training';

  public fullName: string = 'Wally\'s Training SS';

  public text: string =
    'Search your deck for a card that evolves from your Active Pokémon (choose 1 if there are 2) and put it on your ' +
    'Active Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
