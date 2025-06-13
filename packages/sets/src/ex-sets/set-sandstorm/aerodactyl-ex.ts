import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class AerodactylEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Primal Lock',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Aerodactyl ex is in play, your opponent can\'t play Pokémon Tool cards. Remove any Pokémon Tool ' +
        'cards attached to your opponent\'s Pokémon and put them into his or her discard pile.'
    },
  ];

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Aerodactyl ex';

  public fullName: string = 'Aerodactyl ex SS';

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
