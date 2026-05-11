import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';

export class VenusaurEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ivysaur';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 150;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), move a G Energy card attached to 1 of your ' +
        'Pokémon to another of your Pokémon. This power can\'t be used if Venusaur ex is affected by a Special ' +
        'Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Pollen Hazard',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon is now Poisoned, Burned, and Confused.'
    },
    {
      name: 'Solarbeam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '90',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC },
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Venusaur ex';

  public fullName: string = 'Venusaur ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const energyTrans = commonPowers.energyTrans(this, store, state, effect);

    energyTrans.reduce(this.powers[0], CardType.GRASS);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.POISONED,
        SpecialCondition.BURNED,
        SpecialCondition.CONFUSED
      ]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
