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

export class Charizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 120;

  public powers = [
    {
      name: 'Energy Burn',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard ' +
        'into Fire Energy for the rest of the turn. This power can\'t be used if Charizard is Asleep, Confused, or ' +
        'Paralyzed. '
    },
  ];

  public attacks = [
    {
      name: 'Fire Spin',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '100',
      text: 'Discard 2 Energy cards attached to Charizard in order to use this attack.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Charizard';

  public fullName: string = 'Charizard BS';

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
