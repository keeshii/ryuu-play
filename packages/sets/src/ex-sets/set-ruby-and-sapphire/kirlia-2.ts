import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckHpEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PutCountersEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Kirlia2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Dazzle Dance',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Confused.',
    },
    {
      name: 'Life Drain',
      cost: [CardType.PSYCHIC],
      damage: '',
      text:
        'Flip a coin. If heads, put damage counters on the Defending Pokémon until it is 10 HP away from being ' +
        'Knocked Out.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const checkHpEffect = new CheckHpEffect(opponent, opponent.active);
          store.reduceEffect(state, checkHpEffect);
          const damage = Math.max(0, checkHpEffect.hp - opponent.active.damage - 10);

          if (damage > 0) {
            const damageEffect = new PutCountersEffect(effect, damage);
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    return state;
  }
}
