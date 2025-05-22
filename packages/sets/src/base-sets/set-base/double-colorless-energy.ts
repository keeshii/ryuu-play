import {
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StoreLike,
} from '@ptcg/common';

export class DoubleColorlessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BS';

  public name: string = 'Double Colorless Energy';

  public fullName: string = 'Double Colorless Energy BS';

  public text: string = 'Provides ColorlessColorless energy. Doesn\'t count as a basic Energy card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
