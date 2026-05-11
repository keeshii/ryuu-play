import {
  AddSpecialConditionsEffect,
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

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Silcoon and Beautifly, or Cascoon and Dustox cards. Show 1 card or both cards of a ' +
        'pair to your opponent and put them into your hand. Shuffle your deck afterward.',
    },
    {
      name: 'Poison Barb',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wurmple';

  public fullName: string = 'Wurmple RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const signsOfEvolution = commonAttacks.signsOfEvolution(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return signsOfEvolution.use(
        effect,
        ['Silcoon', 'Beautifly'],
        ['Cascoon', 'Dustox']
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
