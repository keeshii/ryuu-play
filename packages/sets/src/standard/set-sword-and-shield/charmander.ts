import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Collect',
      cost: [CardType.FIRE],
      damage: '',
      text: 'Draw a card.',
    },
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '30',
      text: '',
    },
  ];

  public set: string = 'SSH';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    return state;
  }
}
