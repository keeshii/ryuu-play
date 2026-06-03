import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Sand-attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const smokescreen = commonAttacks.smokescreen(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return smokescreen.use(effect);
    }

    return state;
  }
}
