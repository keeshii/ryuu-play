import {
  CardList,
  Effect,
  GameError,
  GameMessage,
  OrderCardsPrompt,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Pokedex extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Pokédex';

  public fullName: string = 'Pokédex BS';

  public text: string = 'Look at up to 5 cards from the top of your deck and rearrange them as you like.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Get up to 5 cards from the top of the deck
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 5);

      return store.prompt(state, new OrderCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARDS_ORDER,
        deckTop,
        { allowCancel: false }
      ), order => {
        if (order !== null) {
          deckTop.applyOrder(order);
        }
        player.deck.cards.unshift(...deckTop.cards);
      });
    }

    return state;
  }
}
