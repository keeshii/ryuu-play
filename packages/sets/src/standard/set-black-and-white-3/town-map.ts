import {
  CardList,
  Effect,
  GameError,
  GameMessage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class TownMap extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Town Map';

  public fullName: string = 'Town Map BKT';

  public text: string =
    'Turn all of your Prize cards face up. (Those Prize cards remain face up for the rest of the game.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const prizes: CardList[] = [...player.prizes, ...opponent.prizes];

      if (prizes.every(cardList => cardList.isPublic && !cardList.isSecret)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      prizes.forEach(p => {
        p.isPublic = true;
        p.isSecret = false;
      });
    }

    return state;
  }
}
