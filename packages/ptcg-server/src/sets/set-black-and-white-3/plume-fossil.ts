import { Card } from '../../game/store/card/card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  const start = player.deck.cards.length < 7 ? 0 : player.deck.cards.length - 7;
  const end = player.deck.cards.length;

  const deckBottom = new CardList();
  deckBottom.cards = player.deck.cards.slice(start, end);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    deckBottom,
    { superType: SuperType.POKEMON, stage: Stage.RESTORED, name: 'Archen' },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class PlumeFossil extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Plume Fossil';

  public fullName: string = 'Plume Fossil NVI';

  public text: string =
    'Look at the bottom 7 cards of your deck. You may reveal an Archen ' +
    'you find there and put is onto your Bench. Shuffle the other cards back ' +
    'into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
