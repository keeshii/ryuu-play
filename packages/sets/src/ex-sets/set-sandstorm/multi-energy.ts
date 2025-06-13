import {
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StoreLike,
} from '@ptcg/common';

export class MultiEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SS';

  public name: string = 'Multi Energy';

  public fullName: string = 'Multi Energy SS';

  public text: string =
    'Attach Multi Energy to 1 of your Pokémon. While in play, Multi Energy provides every type of Energy but ' +
    'provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) Multi energy ' +
    'provides C Energy when attached to a Pokémon that already has Special Energy cards attached to it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
