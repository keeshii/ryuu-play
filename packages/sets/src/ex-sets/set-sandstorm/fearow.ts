import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Spearow';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Double Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Does 20 damage to each Defending Pokémon.'
    },
    {
      name: 'Rend',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'If the Defending Pokémon has any damage counters on it, this attack does 30 damage plus 20 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Fearow';

  public fullName: string = 'Fearow SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = 20;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
