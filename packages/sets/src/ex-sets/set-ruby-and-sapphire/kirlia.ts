import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  EnergyCard,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useRemovalBeam(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      opponent.active,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      const cards: Card[] = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      store.reduceEffect(state, discardEnergy);
    }
  );
}

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
      const generator = useRemovalBeam(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
