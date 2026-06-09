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
import { commonAttacks } from '../../common';

export class DarkJolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Lightning Flash',
      cost: [CardType.LIGHTNING],
      damage: '20',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.'
    },
    {
      name: 'Thunder Attack',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. If tails, Dark Jolteon does 10 damage to ' +
        'itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Jolteon';

  public fullName: string = 'Dark Jolteon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const smokescreen = commonAttacks.smokescreen(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return smokescreen.use(effect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
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
