import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCardList,
  SlotType,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const blocked: CardTarget[] = [];
  let hasEvolvedPokemon: boolean = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.getPokemons().length <= 1) {
      blocked.push(target);
    } else {
      hasEvolvedPokemon = true;
    }
  });

  if (hasEvolvedPokemon === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true, blocked }
    ),
    results => {
      targets = results || [];
      next();
    }
  );

  // Action canceled by user
  if (targets.length === 0) {
    return state;
  }

  const cardList = targets[0];
  const evolutionCards: Card[] = cardList.getPokemons().slice(1);
  const blockedCards: number[] = [];
  cardList.cards.forEach(card => {
    if (!evolutionCards.includes(card)) {
      blockedCards.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      cardList,
      { superType: SuperType.POKEMON },
      { min: 1, max: 1, allowCancel: true, blocked: blockedCards }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Action canceled by user
  if (cards.length === 0) {
    return state;
  }

  const index = evolutionCards.indexOf(cards[0]);
  cards = evolutionCards.slice(index);

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  // Discard Evolution cards
  cardList.moveCardsTo(cards, player.discard);
  cardList.clearEffects();

  return state;
}

export class DevolutionSpray extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Devolution Spray';

  public fullName: string = 'Devolution Spray BS';

  public text: string =
    'Choose 1 of your own Pokémon in play and a Stage of Evolution. Discard all Evolution cards of that Stage or ' +
    'higher attached to that Pokémon. That Pokémon is no longer Asleep, Confused, Paralyzed, Poisoned, or anything ' +
    'else that might be the result of an attack (just as if you had evolved it).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
