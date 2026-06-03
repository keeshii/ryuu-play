import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useFireball(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  store.reduceEffect(state, checkProvidedEnergy);

  // Check, if there is any energy card that is providing FIRE energy
  let hasFireEnergy = false;
  const blocked: number[] = [];
  checkProvidedEnergy.energyMap.forEach(em => {
    const index = player.active.energies.cards.indexOf(em.card);
    if (index === -1) {
      return; // make sure, that energy is attached to the active
    }
    if (em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)) {
      hasFireEnergy = true;
    } else {
      blocked.push(index);
    }
  });

  // No fire energy card attached, nothing to flip
  if (!hasFireEnergy) {
    effect.damage = 0;
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  // Tails, attack does nothing
  if (!flipResult) {
    effect.damage = 0;
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active.energies,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false, blocked }
    ),
    selected => {
      const cards = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      return store.reduceEffect(state, discardEnergy);
    }
  );
}

export class DarkCharmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Tail Slap',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Fireball',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '70',
      text:
        'Use this attack only if there are any R Energy cards attached to Dark Charmeleon. Flip a coin. If heads, ' +
        'discard 1 of those Energy cards. If tails, this attack does nothing (not even damage).'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Charmeleon';

  public fullName: string = 'Dark Charmeleon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useFireball(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
