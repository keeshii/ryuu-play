import {
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutCountersEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Xatu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Natu';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public powers = [
    {
      name: 'Healing Wind',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may remove 1 damage counter from each of your Active ' +
        'Pokémon. This power can\'t be used if Xatu is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Psyimpact',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text: 'Put 1 damage counter on each of your opponent\'s Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Xatu';

  public fullName: string = 'Xatu SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.damage === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);
      const healEffect = new HealEffect(player, player.active, 10);
      store.reduceEffect(state, healEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
        const putCountersEffect = new PutCountersEffect(effect, 10);
        putCountersEffect.target = pokemonSlot;
        store.reduceEffect(state, putCountersEffect);
      });
    }

    return state;
  }
}
