import {
  CardType,
  CheckPokemonTypeEffect,
  DealDamageEffect,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarknessEnergySpecial extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'HGSS';

  public name = 'Darkness Energy (Special)';

  public fullName = 'Darkness Energy (Special) HGSS';

  public text =
    'If the Pokémon Darkness Energy is attached to attacks, ' +
    'the attack does 10 more damage to the Active Pokémon (before applying ' +
    'Weakness and Resistance). Ignore this effect if the Pokémon that ' +
    'Darkness Energy is attached to isn\'t D. Darkness Energy provides ' +
    'D Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect) {
      if (effect.source.cards.includes(this)) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target !== opponent.active) {
          return state;
        }
        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.DARK)) {
          effect.damage += 10;
        }
      }
    }

    return state;
  }
}
