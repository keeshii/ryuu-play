import {
  AttachEnergyEffect,
  CardType,
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect,
  CheckTableStateEffect,
  DealDamageEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class StrongEnergy extends EnergyCard {
  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW4';

  public name = 'Strong Energy';

  public fullName = 'Strong Energy FFI';

  public readonly STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';

  public text =
    'This card can only be attached to F Pokémon. This card provides F ' +
    'Energy only while this card is attached to a F Pokémon. The attacks of ' +
    'the F Pokémon this card is attached to do 20 more damage to your ' +
    'opponent\'s Active Pokémon (before applying Weakness and Resistance). ' +
    '(If this card is attached to anything other than a F Pokémon, discard ' +
    'this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cannot attach to other than Fighting Pokemon
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      return state;
    }

    // Provide energy when attached to Fighting Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      if (checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        effect.energyMap.push({ card: this, provides: [CardType.FIGHTING] });
      }
      return state;
    }

    // Discard card when not attached to Fighting Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
          if (!pokemonSlot.energies.cards.includes(this)) {
            return;
          }
          const checkPokemonType = new CheckPokemonTypeEffect(pokemonSlot);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
            pokemonSlot.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    if (effect instanceof DealDamageEffect && effect.source.energies.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (effect.target !== opponent.active) {
        return state;
      }
      effect.damage += 20;
    }

    return state;
  }
}
