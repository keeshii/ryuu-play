import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class Expall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RG';

  public name: string = 'EXP.ALL';

  public fullName: string = 'EXP.ALL RG';

  public text: string =
    'During your opponent\'s turn, if 1 of your Active Pokémon is Knocked Out by your opponent\'s attack, you may ' +
    'take 1 basic Energy card attached to that Knocked Out Pokémon and attach it to the Pokémon with EXP.ALL ' +
    'attached to it. If you do, discard EXP.ALL.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    commonTrainers.expShare(this, store, state, effect);

    return state;
  }
}
