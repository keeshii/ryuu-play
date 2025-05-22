import {
  AttachEnergyEffect,
  CardType,
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect,
  CheckRetreatCostEffect,
  CheckTableStateEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  State,
  StoreLike,
} from '@ptcg/common';

export class MysteryEnergy extends EnergyCard {
  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW4';

  public name = 'Mystery Energy';

  public fullName = 'Mystery Energy PFO';

  public readonly STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';

  public text =
    'This card can only be attached to P Pokémon. This card provides P ' +
    'Energy, but only while this card is attached to a P Pokémon. ' +
    'The Retreat Cost of the Pokémon this card is attached to is 2 less. ' +
    '(If this card is attached to anything other than a P Pokémon, discard ' +
    'this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cannot attach to other than Psychic Pokemon
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      return state;
    }

    // Provide energy when attached to Psychic Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      if (checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
        effect.energyMap.push({ card: this, provides: [CardType.PSYCHIC] });
      }
      return state;
    }

    // Discard card when not attached to Psychic Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }
          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      if (player.active.cards.includes(this)) {
        for (let i = 0; i < 2; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    return state;
  }
}
