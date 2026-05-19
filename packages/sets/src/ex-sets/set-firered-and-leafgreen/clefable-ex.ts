import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class ClefableEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy cost. (You ' +
        'must still do anything else in order to use that attack.) (No matter what type that Pokémon is, Clefable ' +
        'ex\'s type is still C.) Clefable ex performs that attack.'
    },
    {
      name: 'Moon Impact',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Clefable ex';

  public fullName: string = 'Clefable ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const metronome = commonAttacks.metronome(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return metronome.use(effect);
    }

    return state;
  }
}
