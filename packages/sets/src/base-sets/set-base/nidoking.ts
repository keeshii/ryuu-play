import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nidorino';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Thrash',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 ' +
        'damage and Nidoking does 10 damage to itself.'
    },
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '20',
      text:
        'The Defending Pokémon is now Poisoned. It now takes 20 Poison damage instead of 10 after each player\'s ' +
        'turn (even if it was already Poisoned).'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Nidoking';

  public fullName: string = 'Nidoking BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage += 10;
        } else {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
