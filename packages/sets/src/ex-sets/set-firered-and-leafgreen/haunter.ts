import {
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public powers = [
    {
      name: 'Head Trip',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Haunter is on your Bench, you may use this power. One of ' +
        'your Active Pokémon is now Confused.'
    },
  ];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
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

  public name: string = 'Haunter';

  public fullName: string = 'Haunter RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      let isBenched = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          isBenched = true;
        }
      });

      if (!isBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);
      player.active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.CONFUSED]);
    }

    return state;
  }
}
