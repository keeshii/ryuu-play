import {
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Munna extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Long-Distance Hypnosis',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn (before your attack), you may flip a coin. ' +
        'If heads, your opponent\'s Active Pokémon is now Asleep. ' +
        'If tails, your Active Pokémon is now Asleep.',
    },
  ];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Munna';

  public fullName: string = 'Munna BC';

  public readonly LONG_DISTANCE_HYPNOSIS_MARKER = 'LONG_DISTANCE_HYPNOSIS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
        } else {
          player.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
    }

    return state;
  }
}
