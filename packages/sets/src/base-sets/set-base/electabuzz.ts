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

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Thundershock',
      cost: [CardType.LIGHTNING],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Thunderpunch',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30+',
      text:
        'Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 ' +
        'damage plus Electabuzz does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Electabuzz';

  public fullName: string = 'Electabuzz BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
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

    return state;
  }
}
