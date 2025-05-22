import {
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

function* useExcitableDraw(
  next: Function,
  store: StoreLike,
  state: State,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length + player.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (flipResult) {
    player.hand.moveTo(player.deck);
    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      player.deck.moveTo(player.hand, 6);
      next();
    });
  }

  const endTurnEffect = new EndTurnEffect(player);
  store.reduceEffect(state, endTurnEffect);
  return state;
}

export class Cleffa extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FAIRY;

  public hp: number = 60;

  public retreat = [];

  public powers = [
    {
      name: 'Excitable Draw',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn (before your attack), you may flip a coin. ' +
        'If heads, shuffle your hand into your deck and then draw 6 cards. ' +
        'If you use this Ability, your turn ends.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Cleffa';

  public fullName: string = 'Cleffa UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eeeeeeek
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useExcitableDraw(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
