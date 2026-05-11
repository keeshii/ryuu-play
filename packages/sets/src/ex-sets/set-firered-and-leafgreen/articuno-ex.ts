import {
  AttackEffect,
  Card,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';

function* useColdCrush(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // Active Pokemon has no energy card to discard
  if (player.active.energies.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active.energies,
      { },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Player hasn't discarded energy, stop
  if (cards.length === 0) {
    return state;
  }

  // Discard player's energy card
  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  store.reduceEffect(state, discardEnergy);

  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached, nothing to discard
  if (opponent.active.energies.cards.length === 0) {
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      opponent.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      opponent.active.energies,
      { },
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      const opponentDiscardEnergy = new DiscardCardsEffect(effect, selected);
      opponentDiscardEnergy.target = opponent.active;
      store.reduceEffect(state, opponentDiscardEnergy);
    }
  );
}

export class ArticunoEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 110;

  public powers = [
    {
      name: 'Legendary Ascent',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Articuno ex from your hand onto your Bench, you may switch 1 of your ' +
        'Active Pokémon with Articuno ex. If you do, you may also move any number of basic W Energy cards attached ' +
        'to your Pokémon to Articuno ex.'
    },
  ];

  public attacks = [
    {
      name: 'Cold Crush',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '50',
      text:
        'You may discard an Energy card attached to Articuno ex. If you do, your opponent discards an Energy card ' +
        'attached to the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.METAL }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Articuno ex';

  public fullName: string = 'Articuno ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const legendaryAscent = commonPowers.legendaryAscent(this, store, state, effect);

    legendaryAscent.reduce(this.powers[0], 'Water Energy');

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useColdCrush(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
