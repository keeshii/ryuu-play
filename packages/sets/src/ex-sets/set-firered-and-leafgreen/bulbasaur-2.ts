import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Bulbasaur2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Ram',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Gouge',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Bulbasaur';

  public fullName: string = 'Bulbasaur RG-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}
