import {
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rhyhorn';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 100;

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Ram',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '50',
      text:
        'Rhydon does 20 damage to itself. If your opponent has any Benched Pokémon, he or she chooses 1 of them and ' +
        'switches it with the Defending Pokémon. (Do the damage before switching the Pokémon. Switch the Pokémon ' +
        'even if Rhydon is knocked out.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Rhydon';

  public fullName: string = 'Rhydon JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const opponentSwichesDamageFirst = commonAttacks.opponentSwichesDamageFirst(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

      opponentSwichesDamageFirst.use(effect);
    }

    return state;
  }
}
