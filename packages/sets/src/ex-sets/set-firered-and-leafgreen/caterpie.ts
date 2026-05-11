import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Caterpie extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a Metapod and a Butterfree card, show them to your opponent, and put them into your ' +
        'hand. Shuffle your deck afterward.'
    },
    {
      name: 'String Shot',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Caterpie';

  public fullName: string = 'Caterpie RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);
    const signsOfEvolution = commonAttacks.signsOfEvolution(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return signsOfEvolution.use(effect, ['Metapod', 'Butterfree']);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
