import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Growlithe';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public powers = [
    {
      name: 'Fire Veil',
      powerType: PowerType.POKEBODY,
      text:
        'If Arcanine is your Active Pokémon and is damaged by an opponent\'s attack (even if Arcanine is Knocked ' +
        'Out), the Attacking Pokémon is now Burned.'
    },
  ];

  public attacks = [
    {
      name: 'Burn Up',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: 'Flip a coin. If tails, discard all R Energy cards attached to Arcanine.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Arcanine';

  public fullName: string = 'Arcanine SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
