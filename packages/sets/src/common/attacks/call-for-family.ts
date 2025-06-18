import {
  AttackEffect,
  Card,
  ChooseCardsPrompt,
  Effect,
  FilterType,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
  SuperType
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';


function* useCallForFamily(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  filterType: FilterType,
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 1);

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      filterType,
      { min: 0, max, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index].pokemons);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export const callForFamily: CommonAttack<[FilterType]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, filter: FilterType) => {
      const filterType = { superType: SuperType.POKEMON, stage: Stage.BASIC, ...filter };
      const generator = useCallForFamily(
        () => generator.next(),
        store,
        state,
        effect as AttackEffect,
        filterType
      );
      return generator.next().value;
    }
  };

};
