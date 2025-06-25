import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class Clefable extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and ' +
        'anything else required in order to use that attack, such as discarding Energy cards. (No matter what type ' +
        'the Defending Pokémon is, Clefable\'s type is still Colorless.)'
    },
    {
      name: 'Minimize',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'All damage done by attacks to Clefable during your opponent\'s next turn is reduced by 20 (after applying ' +
        'Weakness and Resistance).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);
    const metronome = commonAttacks.metronome(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return metronome.use(effect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      opponentNextTurn.setMarker(effect, effect.player.active);
      return state;
    }

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage -= 20;
    }

    return state;
  }
}
