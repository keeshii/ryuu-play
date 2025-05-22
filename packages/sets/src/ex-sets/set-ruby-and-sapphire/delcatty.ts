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

export class Delcatty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skitty';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public powers = [
    {
      name: 'Energy Draw',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may discard 1 Energy card from your hand. Then draw up to ' +
        '3 cards from your deck. This power can\'t be used if Delcatty is affected by a Special Condition. '
    },
  ];

  public attacks = [
    {
      name: 'Max Energy Source',
      cost: [CardType.COLORLESS],
      damage: '10×',
      text: 'Does 10 damage times the amount of Energy attached to all of your Active Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Delcatty';

  public fullName: string = 'Delcatty RS';

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
