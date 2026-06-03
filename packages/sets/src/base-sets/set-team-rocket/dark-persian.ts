import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class DarkPersian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Meowth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Fascinate',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with the Defending ' +
        'Pokémon. This attack can\'t be used if your opponent has no Benched Pokémon.'
    },
    {
      name: 'Poison Claws',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Dark Persian';

  public fullName: string = 'Dark Persian TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const switchDamageFirst = commonAttacks.switchDamageFirst(this, store, state, effect);
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          switchDamageFirst.use(effect, false);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.POISONED]);
    }

    return state;
  }
}
