import {
  CardList,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class AcroBike extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Acro Bike';

  public fullName: string = 'Acro Bike PCL';

  public text: string =
    'Look at the top 2 cards of your deck and put 1 of them into your hand. Discard the other card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 2);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          deckTop,
          {},
          { min: 1, max: 1, allowCancel: false }
        ),
        selected => {
          deckTop.moveCardsTo(selected, player.hand);
          deckTop.moveTo(player.discard);
        }
      );
    }

    return state;
  }
}
