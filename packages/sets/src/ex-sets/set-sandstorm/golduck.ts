import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EnergyType,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Psyduck';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public powers = [
    {
      name: 'Chaos Flash',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Golduck is your Active Pokémon, you may flip a coin. If ' +
        'heads, the Defending Pokémon (choose 1 if there are 2) is now Confused. This power can\'t be used if ' +
        'Golduck is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Special Blow',
      cost: [CardType.WATER, CardType.PSYCHIC],
      damage: '30+',
      text:
        'If the Defending Pokémon has any Special Energy cards attached to it, this attack does 30 damage plus 40 ' +
        'more damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Golduck';

  public fullName: string = 'Golduck SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || player.active !== pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.energies.cards.some(e => e.energyType === EnergyType.SPECIAL)) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
