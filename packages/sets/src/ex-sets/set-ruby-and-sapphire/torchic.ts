import {
  AttackEffect,
  Card,
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
  StoreLike,
} from '@ptcg/common';

function* useFireWorks(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (flipResult) {
    return state;
  }

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  return store.prompt(
    state,
    new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      checkProvidedEnergy.energyMap,
      [CardType.FIRE],
      { allowCancel: false }
    ),
    energy => {
      const cards: Card[] = (energy || []).map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }
  );
}

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Peck',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Fireworks',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If tails, discard a R Energy card attached to Torchic.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Torchic';

  public fullName: string = 'Torchic RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useFireWorks(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
