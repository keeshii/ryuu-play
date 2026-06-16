import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Venonat';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Protective Dust',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, except damage, done to Venomoth by the Attacking Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Sleep Poison',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Asleep and Poisoned.'
    },
    {
      name: 'Razor Wind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Venomoth';

  public fullName: string = 'Venomoth RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const protectiveDust = commonPowers.protectiveDust(this, store, state, effect);

    protectiveDust.reduce(this.powers[0]);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.ASLEEP,
        SpecialCondition.POISONED
      ]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
