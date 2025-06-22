import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Transform',
      powerType: PowerType.POKEPOWER,
      text:
        'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including ' +
        'type, Hit Points, Weakness, and so on, except Ditto can\'t evolve, always has this Pokémon Power, and you ' +
        'may treat any Energy attached to Ditto as Energy of any type. Ditto isn\'t a copy of any other Pokémon ' +
        'while Ditto is Asleep, Confused, or Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Ditto';

  public fullName: string = 'Ditto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      // TODO
      return state;
    }

    return state;
  }
}
