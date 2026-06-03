import {
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PowerEffect,
  PowerType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class GoopGasAttack extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Goop Gas Attack';

  public fullName: string = 'Goop Gas Attack TR';

  public text: string = 'All Pokémon Powers stop working until the end of your opponent\'s next turn.';

  public readonly CLEAR_GOOP_GAS_ATTACK_MARKER = 'CLEAR_GOOP_GAS_ATTACK_MARKER';

  public readonly GOOP_GAS_ATTACK_MARKER = 'GOOP_GAS_ATTACK_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_GOOP_GAS_ATTACK_MARKER, this)
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      player.marker.removeMarker(this.CLEAR_GOOP_GAS_ATTACK_MARKER, this);
      player.marker.removeMarker(this.GOOP_GAS_ATTACK_MARKER, this);
      opponent.marker.removeMarker(this.GOOP_GAS_ATTACK_MARKER, this);
    }

    if (effect instanceof PowerEffect
      && effect.power.powerType === PowerType.POKEPOWER
      && effect.player.marker.hasMarker(this.GOOP_GAS_ATTACK_MARKER, this)
    ) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      player.marker.addMarker(this.GOOP_GAS_ATTACK_MARKER, this);
      opponent.marker.addMarker(this.GOOP_GAS_ATTACK_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_GOOP_GAS_ATTACK_MARKER, this);
    }

    return state;
  }
}
