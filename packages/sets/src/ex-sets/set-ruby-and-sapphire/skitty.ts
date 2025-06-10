import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  EnergyType,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useMinorErrandRunning(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] | null = [];

  if (player.deck.cards.length === 0) {
    return state;
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 0, max: 2, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Minor Errand-Running',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for 2 basic Energy cards, show them to your opponent, and put them into your hand. ' +
        'Shuffle your deck afterward.',
    },
    {
      name: 'Lullaby',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Asleep.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Skitty';

  public fullName: string = 'Skitty RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMinorErrandRunning(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
