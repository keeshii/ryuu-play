import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked = player.deck.cards
    .filter(c => c instanceof PokemonCard && !c.name.startsWith('Dark '))
    .map(c => player.deck.cards.indexOf(c));

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      { min: 1, max: 1, allowCancel: true, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class TheBosssWay extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'The Boss\'s Way';

  public fullName: string = 'The Boss\'s Way TR';

  public text: string =
    'Search your deck for an Evolution card with Dark in its name. Show it to your opponent and put it into your ' +
    'hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
