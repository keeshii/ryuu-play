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

export class Xatu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Natu';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public powers = [
    {
      name: 'Healing Wind',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may remove 1 damage counter from each of your Active ' +
        'Pokémon. This power can\'t be used if Xatu is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Psyimpact',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text: 'Put 1 damage counter on each of your opponent\'s Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Xatu';

  public fullName: string = 'Xatu SS';

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
