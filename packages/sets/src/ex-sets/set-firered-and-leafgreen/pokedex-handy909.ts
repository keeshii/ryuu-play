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


export class PokedexHandy909 extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'PokéDex HANDY909';

  public fullName: string = 'PokeDex HANDY909 RG';

  public text: string =
    'Shuffle your deck. Look at 6 cards from the top of your deck, then put them back on top of your deck in any ' +
    'order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 6);

      return store.prompt(
        state,
        new OrderCardsPrompt(player.id, GameMessage.CHOOSE_CARDS_ORDER, deckTop, {
          allowCancel: true,
        }),
        order => {
          if (order !== null) {
            deckTop.applyOrder(order);
          }
          player.deck.cards.unshift(...deckTop.cards);
        }
      );
    }

    return state;
  }
}
