import {
  Effect,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class N extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'DP';

  public name: string = 'N';

  public fullName: string = 'N NV';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. ' +
    'Then, each player draws a card for each of his or her remaining Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cards = player.hand.cards.filter(c => c !== this);

      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveTo(opponent.deck);

      store.prompt(state, [new ShuffleDeckPrompt(player.id), new ShuffleDeckPrompt(opponent.id)], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        player.deck.moveTo(player.hand, player.getPrizeLeft());
        opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
      });
    }

    return state;
  }
}
