import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';

export class TownMap extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Town Map';

  public fullName: string = 'Town Map BKT';

  public text: string =
    'Turn all of your Prize cards face up. (Those Prize cards remain ' +
    'face up for the rest of the game.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.prizes.forEach(p => {
        p.isPublic = true;
        p.isSecret = false;
      });
    }

    return state;
  }

}
