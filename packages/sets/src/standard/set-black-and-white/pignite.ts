import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  EnergyType,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useFlameCharge(next: Function, store: StoreLike, state: State, self: Pignite, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot) {
    return state;
  }

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.deck,
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Fire Energy',
      },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    player.deck.moveCardsTo(cards, pokemonSlot.energies);
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Pignite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Tepig';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 100;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flame Charge',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for a R Energy card and attach it to this Pokémon. Shuffle your deck afterward.',
    },
    {
      name: 'Heat Crash',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Pignite';

  public fullName: string = 'Pignite BW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFlameCharge(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
