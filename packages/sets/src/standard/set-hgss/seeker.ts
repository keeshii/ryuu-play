import {
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function pickUpBenchedPokemon(next: Function, store: StoreLike, state: State, player: Player): State {
  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ),
    selection => {
      const cardList = selection[0];
      cardList.moveTo(player.hand);
      cardList.clearEffects();
      next();
    }
  );
}

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const playerHasBench = player.bench.some(b => b.pokemons.cards.length > 0);
  const opponentHasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (!playerHasBench && !opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (playerHasBench) {
    yield pickUpBenchedPokemon(next, store, state, player);
  }

  if (opponentHasBench) {
    yield pickUpBenchedPokemon(next, store, state, opponent);
  }

  return state;
}

export class Seeker extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Seeker';

  public fullName: string = 'Seeker TRM';

  public text: string =
    'Each player returns 1 of his or her Benched Pokémon and all cards ' +
    'attached to it to his or her hand. (You return your Pokémon first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
