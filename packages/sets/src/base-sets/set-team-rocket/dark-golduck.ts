import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
  SuperType
} from '@ptcg/common';

function* useThirdEye(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active.energies,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length === 0) {
    return state;
  }

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  store.reduceEffect(state, discardEnergy);

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Draw up to 3 cards
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 0, max: 3, allowCancel: true, isSecret: true }
    ),
    selected => {
      const cards = selected || [];
      player.deck.moveTo(player.hand, cards.length);
    }
  );
}

export class DarkGolduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Psyduck';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Third Eye',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Discard 1 Energy card attached to Dark Golduck in order to draw up to 3 cards.'
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Golduck';

  public fullName: string = 'Dark Golduck TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useThirdEye(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
