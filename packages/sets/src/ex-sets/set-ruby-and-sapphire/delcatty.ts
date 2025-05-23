import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  ConfirmPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useEnergyDraw(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const hasEnergyCardInHand = player.hand.cards.some(c => c.superType === SuperType.ENERGY);
  if (!hasEnergyCardInHand) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const target = StateUtils.findCardList(state, effect.card);
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      target,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Action canceled by user
  if (cards.length === 0) {
    return state;
  }

  target.moveCardsTo(cards, player.discard);

  const cardsToDraw = Math.min(3, player.deck.cards.length);

  // Nothing to draw
  if (cardsToDraw === 0) {
    return state;
  }

  // TODO: Add possibility to choose, how many cards to draw
  return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_DRAW_CARDS), result => {
    if (result) {
      player.deck.moveTo(player.hand, cardsToDraw);
    }
  });
}

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
        '3 cards from your deck. This power can\'t be used if Delcatty is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Max Energy Source',
      cost: [CardType.COLORLESS],
      damage: '10×',
      text: 'Does 10 damage times the amount of Energy attached to all of your Active Pokémon.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Delcatty';

  public fullName: string = 'Delcatty RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useEnergyDraw(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage = energyCount * 10;
    }

    return state;
  }
}
