import {
  Effect,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class HereComesTeamRocket extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Here Comes Team Rocket!';

  public fullName: string = 'Here Comes Team Rocket! TR';

  public text: string = 'Each player plays with his or her Prize cards face up for the rest of the game.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.prizes.forEach(p => {
        p.isPublic = true;
        p.isSecret = false;
      });

      opponent.prizes.forEach(p => {
        p.isPublic = true;
        p.isSecret = false;
      });
    }

    return state;
  }
}
