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

export class DarkAlakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Kadabra';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Teleport Blast',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text:
        'You may switch Dark Alakazam with 1 of your Benched Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mind Shock',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '40',
      text:
        'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying ' +
        'Weakness and Resistance still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Alakazam';

  public fullName: string = 'Dark Alakazam TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const switchDamageFirst = commonAttacks.switchDamageFirst(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return switchDamageFirst.use(effect, true);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return state;
    }

    return state;
  }
}
