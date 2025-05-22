import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Delcatty2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skitty';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Energy Call',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Attach 1 Energy card from your discard pile to your Active Pokémon.'
    },
    {
      name: 'Cannonball',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 10 more damage for each Energy attached to Delcatty but not used to pay for this ' +
        'attack\'s Energy cost. '
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Delcatty';

  public fullName: string = 'Delcatty RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
