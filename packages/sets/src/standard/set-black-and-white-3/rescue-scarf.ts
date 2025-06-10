import {
  BetweenTurnsEffect,
  Card,
  Effect,
  GamePhase,
  KnockOutEffect,
  State,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class RescueScarf extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW3';

  public name: string = 'Rescue Scarf';

  public fullName: string = 'Rescue Scarf DGE';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from ' +
    'an attack, put that Pokémon into your hand. (Discard all cards ' +
    'attached to that Pokémon.)';

  public readonly RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.trainers.cards.includes(this)) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.RESCUE_SCARF_MAREKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {
        if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) {
          return;
        }

        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.RESCUE_SCARF_MAREKER)
          .map(m => m.source);

        player.discard.moveCardsTo(rescued, player.hand);
        player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);
      });
    }

    return state;
  }
}
