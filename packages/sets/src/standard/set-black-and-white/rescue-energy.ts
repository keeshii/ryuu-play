import {
  BetweenTurnsEffect,
  Card,
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  GamePhase,
  KnockOutEffect,
  State,
  StoreLike,
} from '@ptcg/common';

export class RescueEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rescue Energy';

  public fullName = 'Rescue Energy TRM';

  public readonly RESCUE_ENERGY_MAREKER = 'RESCUE_ENERGY_MAREKER';

  public text =
    'Rescue Energy provides C Energy. If the Pokémon this card is attached ' +
    'to is Knocked Out by damage from an attack, put that Pokémon back into ' +
    'your hand. (Discard all cards attached to that Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.energies.cards.includes(this)) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.RESCUE_ENERGY_MAREKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {
        if (!player.marker.hasMarker(this.RESCUE_ENERGY_MAREKER)) {
          return;
        }

        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.RESCUE_ENERGY_MAREKER)
          .map(m => m.source);

        player.discard.moveCardsTo(rescued, player.hand);
        player.marker.removeMarker(this.RESCUE_ENERGY_MAREKER);
      });
    }

    return state;
  }
}
