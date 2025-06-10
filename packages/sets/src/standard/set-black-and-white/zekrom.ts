import { AttackEffect, CardType, DealDamageEffect, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Zekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Outrage',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 10 more damage for each damage counter on this Pokémon.',
    },
    {
      name: 'Bolt Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '120',
      text: 'This Pokémon does 40 damage to itself.',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Zekrom';

  public fullName: string = 'Zekrom BW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 40);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
