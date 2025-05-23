import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Removal Beam',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: 'Flip a coin. If heads, discard 1 Energy card attached to the Defending Pokémon.',
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
