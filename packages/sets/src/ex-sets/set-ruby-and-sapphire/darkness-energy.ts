import {
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StoreLike,
} from '@ptcg/common';

export class DarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RS';

  public name: string = 'Darkness Energy';

  public fullName: string = 'Darkness Energy RS';

  public text: string =
    'If the Pokémon Darkness Energy is attached to attacks, the attack does 10 more damage to the Active Pokémon ' +
    '(before applying Weakness and Resistance). Ignore this effect unless the Attacking Pokémon is Darkness or has ' +
    'Dark in its name. Darkness Energy provides Darkness Energy. (Doesn\'t count as a basic Energy card.) ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
