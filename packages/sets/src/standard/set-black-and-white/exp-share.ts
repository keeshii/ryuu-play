import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class ExpShare extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW';

  public name: string = 'Exp Share';

  public fullName: string = 'Exp Share SUM';

  public text: string =
    'When your Active Pokémon is Knocked Out by damage from an opponent\'s ' +
    'attack, you may move 1 basic Energy card that was attached to that ' +
    'Pokémon to the Pokémon this card is attached to.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    commonTrainers.expShare(this, store, state, effect);

    return state;
  }
}
