import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Jigglypuff';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Lullaby',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Do the Wave',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each of your Benched Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Wigglytuff';

  public fullName: string = 'Wigglytuff JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const benched = player.bench.reduce((left, b) => left + (b.pokemons.cards.length ? 1 : 0), 0);
      effect.damage += benched * 10;
    }

    return state;
  }
}
