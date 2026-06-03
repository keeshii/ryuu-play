import {
  ChooseCardsPrompt,
  ConfirmPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonSlot,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const slotsOpponent: PokemonSlot[] = opponent.bench.filter(b => b.pokemons.cards.length === 0);

  if (player.deck.cards.length === 0 && opponent.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (slots.length + slotsOpponent.length === 0) {
    player.deck.moveTo(player.hand, 2);
    return state;
  }

  let wantToUse = false;
  yield store.prompt(
    state,
    new ConfirmPrompt(opponent.id, GameMessage.CHOOSE_OPTION),
    result => {
      wantToUse = result;
      next();
    }
  );

  if (!wantToUse) {
    player.deck.moveTo(player.hand, 2);
  }

  // Player
  // Pokemon face-down onto Bench
  let max = slots.length;
  store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max, allowCancel: true }
    ),
    selected => {
      const cards = selected || [];
      if (cards.length > slots.length) {
        cards.length = slots.length;
      }
      cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index].pokemons);
        slots[index].pokemons.isPublic = false;
        slots[index].pokemonPlayedTurn = state.turn;
      });
    }
  );

  // Opponent
  // Pokemon face-down onto Bench
  max = slotsOpponent.length;
  store.prompt(
    state,
    new ChooseCardsPrompt(
      opponent.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      opponent.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max, allowCancel: true }
    ),
    selected => {
      const cards = selected || [];
      if (cards.length > slots.length) {
        cards.length = slots.length;
      }
      cards.forEach((card, index) => {
        opponent.deck.moveCardTo(card, slotsOpponent[index].pokemons);
        slotsOpponent[index].pokemons.isPublic = false;
        slotsOpponent[index].pokemonPlayedTurn = state.turn;
      });
    }
  );

  // Wait for players to choose Pokemon
  yield store.waitPrompt(state, () => next());

  // Turn all slots face-up
  slots.forEach(slot => {
    slot.pokemons.isPublic = true;
  });

  slotsOpponent.forEach(slot => {
    slot.pokemons.isPublic = true;
  });

  // Shuffle decks
  store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

  store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });

  return state;
}

export class Challenge extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Challenge!';

  public fullName: string = 'Challenge! TR';

  public text: string =
    'Ask your opponent if he or she accepts your challenge. If your opponent declines (or if both Benches are ' +
    'full), draw 2 cards. If your opponent accepts, each of you searches your decks for any number of Basic Pokémon ' +
    'cards and puts them face down onto your Benches. (A player can\'t do this if his or her Bench is full.) When ' +
    'you both have finished, shuffle your decks and turn those cards face up.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
