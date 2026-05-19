import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
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
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

const QUICK_SEARCH_MARKER = 'QUICK_SEARCH_MARKER';

function* useQuickSearch(next: Function, store: StoreLike, state: State, effect: PowerEffect, self: PokemonCard): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (player.marker.hasMarker(QUICK_SEARCH_MARKER)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.marker.addMarker(QUICK_SEARCH_MARKER, self);
  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Pidgeotto';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Quick Search',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may choose any 1 card from your deck and put it into your ' +
        'hand. Shuffle your deck afterward. You can\'t use more than 1 Quick Search Poké-Power each turn. This power ' +
        'can\'t be used if Pidgeot is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Clutch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Pidgeot';

  public fullName: string = 'Pidgeot RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useQuickSearch(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return cantRetreat.use(effect);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(QUICK_SEARCH_MARKER, this);
    }

    return state;
  }
}
