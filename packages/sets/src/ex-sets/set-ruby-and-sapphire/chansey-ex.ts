import {
  AttackEffect,
  CardTag,
  CardType,
  DealDamageEffect,
  Effect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class ChanseyEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 120;

  public attacks = [
    {
      name: 'Healing Egg',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Remove 2 damage counters (1 if there is only 1) from each of your Pokémon. Remove no damage counters from ' +
        'Chansey ex.',
    },
    {
      name: 'Double-edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Chansey ex does 60 damage to itself.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Chansey ex';

  public fullName: string = 'Chansey ex RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.bench.forEach(bench => {
        const healTargetEffect = new HealTargetEffect(effect, 20);
        healTargetEffect.target = bench;
        state = store.reduceEffect(state, healTargetEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 60);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
