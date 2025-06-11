import {
  Effect,
  EndTurnEffect,
  GameError,
  GameLog,
  GameMessage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class TropicalBeach extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Tropical Beach';

  public fullName: string = 'Tropical Beach BW';

  public text: string =
    'Once during each player\'s turn, that player may draw cards ' +
    'until he or she has 7 cards in his or her hand. If he or she does, ' +
    'that player\'s turn ends.';

  public useWhenInPlay = true;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0 || player.hand.cards.length >= 7) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      const cardsToDraw = 7 - player.hand.cards.length;
      player.deck.moveTo(player.hand, cardsToDraw);

      // Log the message before turn ends.
      effect.preventDefault = true;
      store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, {
        name: player.name,
        stadium: effect.stadium.name,
      });
      player.stadiumUsedTurn = state.turn;

      const endTurnEffect = new EndTurnEffect(player);
      return store.reduceEffect(state, endTurnEffect);
    }

    return state;
  }
}
