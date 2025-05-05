import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardTag } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { Card } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { CardList } from '@ptcg/common';


function* playCard(next: Function, store: StoreLike, state: State,
  self: ComputerSearch, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];
  
  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    { },
    { min: 2, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardTo(self, player.discard);
  player.hand.moveCardsTo(cards, player.discard);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);
  return state;
}

export class ComputerSearch extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [ CardTag.ACE_SPEC ];

  public set: string = 'BW';

  public name: string = 'Computer Search';

  public fullName: string = 'Computer Search BCR';

  public text: string =
    'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' +
    'you can\'t play this card.) Search your deck for a card and put it into ' +
    'your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
