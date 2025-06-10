import {
  CardType,
  CheckPokemonTypeEffect,
  Effect,
  EnergyCard,
  EnergyType,
  PutDamageEffect,
  State,
  StoreLike,
} from '@ptcg/common';

export class MetalEnergySpecial extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'HGSS';

  public name = 'Metal Energy (Special)';

  public fullName = 'Metal Energy (Special) HGSS';

  public text =
    'Damage done by attacks to the Pokémon that Metal Energy is ' +
    'attached to is reduced by 10 (after applying Weakness and Resistance). ' +
    'Ignore this effect if the Pokémon that Metal Energy is attached to ' +
    'isn\'t M. Metal Energy provides M Energy. (Doesn\'t count as a basic ' +
    'Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect) {
      if (effect.target.energies.cards.includes(this)) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
          effect.damage -= 10;
        }
      }
    }

    return state;
  }
}
