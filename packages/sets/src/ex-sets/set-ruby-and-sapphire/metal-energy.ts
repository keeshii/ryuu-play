import { CardType, Effect, EnergyCard, EnergyType, State, StoreLike } from '@ptcg/common';

export class MetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RS';

  public name: string = 'Metal Energy';

  public fullName: string = 'Metal Energy RS';

  public text: string =
    'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying ' +
    'Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t Metal. ' +
    'Metal Energy provides Metal Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
