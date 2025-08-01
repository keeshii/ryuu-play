import {
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

  const playerHasBench = player.bench.some(b => b.pokemons.cards.length > 0);
  const opponentHasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (!playerHasBench && !opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let targets: PokemonSlot[] = [];
  if (opponentHasBench) {
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ),
      results => {
        targets = results || [];
        next();
      }
    );

    if (targets.length > 0) {
      opponent.switchPokemon(targets[0]);
    }
  }

  if (playerHasBench) {
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ),
      results => {
        targets = results || [];
        next();
      }
    );

    if (targets.length > 0) {
      player.switchPokemon(targets[0]);
    }
  }

  return state;
}

export class EscapeRope extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Escape Rope';

  public fullName: string = 'Escape Rope PLS';

  public text: string =
    'Each player switches his or her Active Pokémon with 1 of his or her ' +
    'Benched Pokémon. (Your opponent switches first. If a player does not ' +
    'have a Benched Pokémon, he or she doesn\'t switch Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
