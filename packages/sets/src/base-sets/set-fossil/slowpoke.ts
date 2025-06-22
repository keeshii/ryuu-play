import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  ChooseEnergyPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

function* useScavenge(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const itemTypes = [TrainerType.ITEM, TrainerType.TOOL];

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      checkProvidedEnergy.energyMap,
      [CardType.PSYCHIC],
      { allowCancel: false }
    ),
    energy => {
      cards = (energy || []).map(e => e.card);
      next();
    }
  );
  
  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  store.reduceEffect(state, discardEnergy);
  
  let trainersCount = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && itemTypes.includes(c.trainerType)) {
      trainersCount += 1;
    } else {
      blocked.push(index);
    }
  });

  if (trainersCount === 0) {
    return state;
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      { min: 1, max: 1, allowCancel: false, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.discard.moveCardsTo(cards, player.hand);
  return state;
}

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Spacing Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, remove a damage counter from Slowpoke. This attack can\'t be used if Slowpoke has no ' +
        'damage counters on it.'
    },
    {
      name: 'Scavenge',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 P Energy card attached to Slowpoke in order to use this attack. Put a Trainer card from your ' +
        'discard pile into your hand.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Slowpoke';

  public fullName: string = 'Slowpoke FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.active.damage === 0) {
        return state;
      }

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const healEffect = new HealTargetEffect(effect, 10);
          healEffect.target = player.active;
          return store.reduceEffect(state, healEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useScavenge(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
