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

function* useStoneBarrage(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;

  let flipResult = false;
  let heads = 0;
  do {
    yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
      flipResult = result;
      heads += flipResult ? 1 : 0;
      next();
    });
  } while (flipResult);

  effect.damage = heads * 10;
  return state;
}

export class Geodude extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Stone Barrage',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '10×',
      text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Geodude';

  public fullName: string = 'Geodude FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useStoneBarrage(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
