import {
  Card,
  ChooseCardsPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: NightlyGarbageRun,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let pokemonsOrEnergyInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isPokemon = c instanceof PokemonCard;
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (isPokemon || isBasicEnergy) {
      pokemonsOrEnergyInDiscard += 1;
    } else {
      blocked.push(index);
    }
  });

  // Player does not have correct cards in discard
  if (pokemonsOrEnergyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(3, pokemonsOrEnergyInDiscard);
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      {},
      { min: 1, max, allowCancel: true, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
    next()
  );

  player.hand.moveCardTo(self, player.discard);
  player.discard.moveCardsTo(cards, player.deck);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class NightlyGarbageRun extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Nightly Garbage Run';

  public fullName: string = 'Nightly Garbage Run TR';

  public text: string =
    'Choose up to 3 Basic Pokémon cards, Evolution cards, and/or basic Energy cards from your discard pile. Show ' +
    'them to your opponent and shuffle them into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
