import {
  AttackEffect,
  Card,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useTwister(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const energiesToDiscard: CardType[] = [];

  yield store.prompt(
    state,
    [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
    results => {
      results
        .filter(result => result)
        .forEach(() => energiesToDiscard.push(CardType.COLORLESS));
      next();
    }
  );

  // Both tails, attack does nothing
  if (energiesToDiscard.length === 0) {
    effect.damage = 0;
    return state;
  }

  // No energies to discard
  if (opponent.active.energies.cards.length === 0) {
    return state;
  }

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
  state = store.reduceEffect(state, checkProvidedEnergy);

  return store.prompt(
    state,
    new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      checkProvidedEnergy.energyMap,
      energiesToDiscard,
      { allowCancel: false }
    ),
    energy => {
      const cards: Card[] = (energy || []).map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      store.reduceEffect(state, discardEnergy);
    }
  );
}

export class GyaradosEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magikarp';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 130;

  public attacks = [
    {
      name: 'Twister',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '40',
      text:
        'Flip 2 coins. For each heads, choose 1 Energy attached to the Defending Pokémon, if any, and discard it. ' +
        'If both are tails, this attack does nothing.'
    },
    {
      name: 'Dragon Rage',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Gyarados ex';

  public fullName: string = 'Gyarados ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useTwister(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
