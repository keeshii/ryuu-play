import {
  DealDamageEffect,
  Effect,
  EndTurnEffect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class PlusPower extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'PlusPower';

  public fullName: string = 'PlusPower BW';

  public text: string =
    'During this turn, your Pokémon\'s attacks do 10 more damage to the ' +
    'Active Pokémon (before applying Weakness and Resistance).';

  private readonly PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.PLUS_POWER_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.PLUS_POWER_MARKER, this) && effect.damage > 0) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
    }

    return state;
  }
}
