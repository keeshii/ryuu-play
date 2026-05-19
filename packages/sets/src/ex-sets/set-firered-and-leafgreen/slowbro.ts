import {
  AttackEffect,
  CardType,
  Effect,
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
import { commonAttacks, commonPowers } from '../../common';

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slowpoke';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public powers = [
    {
      name: 'Strange Behavior',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your ' +
        'Pokémon to Slowbro as long as you don\'t Knock Out Slowbro. This power can\'t be used if Slowbro is affected ' +
        'by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const strangeBehavior = commonPowers.strangeBehavior(this, store, state, effect);
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, effect.card);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      strangeBehavior.reduce(this.powers[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
