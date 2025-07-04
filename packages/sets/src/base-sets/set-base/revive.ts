import {
  CheckHpEffect,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  Stage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);

  // Player has no empty bench slot
  if (slots.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Player has no basic Pokemons in the discard pile
  if (!player.discard.cards.some(c => c instanceof PokemonCard && c.stage === Stage.BASIC)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.discard,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      if (selected && selected.length > 0) {
        // Discard trainer only when user selected a Pokemon
        player.hand.moveCardTo(effect.trainerCard, player.discard);
        // Recover discarded Pokemon
        player.discard.moveCardsTo(selected, slots[0].pokemons);
        slots[0].pokemonPlayedTurn = state.turn;
        // Put damage counters equal to half its HP
        const checkHpEffect = new CheckHpEffect(player, slots[0]);
        store.reduceEffect(state, checkHpEffect);
        slots[0].damage = Math.floor(checkHpEffect.hp / 20) * 10;
      }
    }
  );
}

export class Revive extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Revive';

  public fullName: string = 'Revive BS';

  public text: string =
    'Put 1 Basic Pokémon card from your discard pile onto your Bench. Put damage counters on that Pokémon equal to ' +
    'half its HP (rounded down to the nearest 10). (You can\'t play Revive if your Bench is full.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
