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

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Dizziness',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Draw a card.'
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '20+',
      text:
        'Does 20 damage plus 10 more damage for each W Energy attached to Psyduck but not used to pay for this ' +
        'attack. You can\'t add more than 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Psyduck';

  public fullName: string = 'Psyduck TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const additionalEnergyDamage = commonAttacks.additionalEnergyDamage(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return additionalEnergyDamage.use(effect, CardType.WATER, 10, 2);
    }

    return state;
  }
}
