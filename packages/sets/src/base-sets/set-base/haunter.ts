import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Hypnosis',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Dream Eater',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '50',
      text: 'You can\'t use this attack unless the Defending Pokémon is Asleep.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      if (!opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
      }
    }

    return state;
  }
}
