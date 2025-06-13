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

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Curse',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may move 1 damage counter from 1 of your opponent\'s ' +
        'Pokémon to another (even if it would Knock Out the other Pokémon). This power can\'t be used if Gengar is ' +
        'Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Dark Mind',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text:
        'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar FO';

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
