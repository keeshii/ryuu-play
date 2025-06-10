import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonSlot,
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

  let playerHasEnergy = false;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
    if (pokemonSlot.energies.cards.length > 0) {
      playerHasEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  let opponentHasEnergy = false;
  const blocked2: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card, target) => {
    if (pokemonSlot.energies.cards.length > 0) {
      opponentHasEnergy = true;
    } else {
      blocked2.push(target);
    }
  });

  if (!playerHasEnergy || !opponentHasEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  
  let targets: PokemonSlot[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: true, blocked }
  ), results => {
    targets = results || [];
    next();
  });
  
  if (targets.length === 0) {
    return state;
  }
  const playerTarget = targets[0];

  let playerCards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    playerTarget.energies,
    { },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    playerCards = selected || [];
    next();
  });

  if (playerCards.length === 0) {
    return state;
  }

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: true, blocked: blocked2 }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }
  const opponentTarget = targets[0];

  let opponentCards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    opponentTarget.energies,
    { },
    { min: 1, max: 2, allowCancel: false }
  ), selected => {
    opponentCards = selected || [];
    next();
  });

  if (opponentCards.length === 0) {
    return state;
  }

  playerTarget.moveCardsTo(playerCards, player.discard);
  opponentTarget.moveCardsTo(opponentCards, opponent.discard);
  player.hand.moveCardTo(effect.trainerCard, player.discard);
  return state;
}

export class SuperEnergyRemoval extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Super Energy Removal';

  public fullName: string = 'Super Energy Removal BS';

  public text: string =
    'Discard 1 Energy card attached to 1 of your Pokémon in order to choose 1 of your opponent\'s Pokémon and up to ' +
    '2 Energy cards attached to it. Discard those Energy cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
