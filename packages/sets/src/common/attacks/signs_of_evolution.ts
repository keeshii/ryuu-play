import {
  AttackEffect,
  Card,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  SuperType
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

function* useSignsOfEvolution(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  ...evolutionLines: string[][]
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    return state;
  }

  const allowedNames: string[] = [];
  let max = 1;
  for (const evolutionLine of evolutionLines) {
    allowedNames.push(...evolutionLine);
    if (max < evolutionLine.length) {
      max = evolutionLine.length;
    }
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!allowedNames.includes(card.name)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  let isFromOneEvolutionLine = true;
  let withoutDuplicates = true;
  do {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { allowCancel: true, min: 1, max, blocked }
      ),
      selected => {
        cards = selected || [];
        next();
      }
    );

    isFromOneEvolutionLine = evolutionLines.some(evolutionLine => cards.every(card => evolutionLine.includes(card.name)));
    withoutDuplicates = cards.every((card, index) => cards.findIndex(c => c.name === card.name) === index);
  } while (!isFromOneEvolutionLine || !withoutDuplicates);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export const signsOfEvolution: CommonAttack<string[][]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, ...evolutionLines: string[][]) => {
      const generator = useSignsOfEvolution(
        () => generator.next(),
        store,
        state,
        effect as AttackEffect,
        ...evolutionLines
      );
      return generator.next().value;
    }
  };

};
