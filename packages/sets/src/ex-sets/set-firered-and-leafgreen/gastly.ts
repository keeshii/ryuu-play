import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Slow Trip Gas',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'At the end of your opponent\'s next turn, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.DARK }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Gastly';

  public fullName: string = 'Gastly RG';

  public readonly SLOW_TRIP_GAS_MARKER = 'SLOW_TRIP_GAS_MARKER';

  public readonly CLEAR_SLOW_TRIP_GAS_MARKER = 'CLEAR_SLOW_TRIP_GAS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_SLOW_TRIP_GAS_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SLOW_TRIP_GAS_MARKER, this);
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (player.active.marker.hasMarker(this.SLOW_TRIP_GAS_MARKER, this)) {
        const attackEffect = new AttackEffect(opponent, player, this.attacks[0]);
        const specialConditionEffect = new AddSpecialConditionsEffect(attackEffect, [SpecialCondition.CONFUSED]);
        store.reduceEffect(state, specialConditionEffect);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.SLOW_TRIP_GAS_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SLOW_TRIP_GAS_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SLOW_TRIP_GAS_MARKER, this);
      return state;
    }

    return state;
  }
}
