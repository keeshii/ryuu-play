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

export class Pidgeotto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending ' +
        'Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mirror Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending ' +
        'Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Pidgeotto';

  public fullName: string = 'Pidgeotto BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const mirrorMove = commonAttacks.mirrorMove(this, store, state, effect);
    const opponentSwichesDamageFirst = commonAttacks.opponentSwichesDamageFirst(this, store, state, effect);

    // Whirlwind
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      opponentSwichesDamageFirst.use(effect);
    }

    // Mirror Move
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return mirrorMove.use(effect);
    }

    return state;
  }
}
