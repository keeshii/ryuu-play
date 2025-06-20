import { AttackEffect, CardType, DealDamageEffect, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Koffing extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Double-edge',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '30',
      text: 'Koffing does 10 damage to itself.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Koffing';

  public fullName: string = 'Koffing RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
