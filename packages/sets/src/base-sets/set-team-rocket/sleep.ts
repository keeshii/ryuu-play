import {
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  SpecialCondition,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Sleep extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Sleep!';

  public fullName: string = 'Sleep! TR';

  public text: string = 'Flip a coin. If heads, the Defending Pokémon is now Asleep.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });
    }

    return state;
  }
}
