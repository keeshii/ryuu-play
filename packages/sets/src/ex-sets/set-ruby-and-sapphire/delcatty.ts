import {
  AttackEffect,
  Card,
  CardList,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useEnergyDraw(next: Function, store: StoreLike, state: State, self: Delcatty, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const cardList = StateUtils.findCardList(state, self) as PokemonCardList;
  if (cardList.specialConditions.length > 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

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
      player.hand,
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

  const deckTop = new CardList();
  deckTop.cards = player.deck.top(3);

  // Nothing to draw
  if (deckTop.cards.length === 0) {
    return state;
  }

  // Draw up to 3 cards.
  // Reconsider different prompt, so it not confuse user, that he can select cards not from the top
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckTop,
      {},
      { min: 0, max: deckTop.cards.length, allowCancel: true, isSecret: true }
    ),
    selected => {
      cards = selected || [];
      player.deck.moveTo(player.hand, cards.length);
    }
  );
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
      useWhenInPlay: true,
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
      const generator = useEnergyDraw(() => generator.next(), store, state, this, effect);
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
