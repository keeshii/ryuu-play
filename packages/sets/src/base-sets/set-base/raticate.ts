import {
  AttackEffect,
  CardType,
  CheckHpEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rattata';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Super Fang',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Does damage to the Defending Pokémon equal to half the Defending Pokémon\'s remaining HP (rounded up to the ' +
        'nearest 10).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Raticate';

  public fullName: string = 'Raticate BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkHpEffect = new CheckHpEffect(player, opponent.active);
      store.reduceEffect(state, checkHpEffect);
      const hp = checkHpEffect.hp - opponent.active.damage;

      effect.damage = Math.ceil(hp / 20) * 10;
    }

    return state;
  }
}
