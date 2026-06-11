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
  SuperType
} from '@ptcg/common';

function* usePlayingWithFire(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
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
    if (em.provides.includes(CardType.FIRE)) {
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
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active.energies,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false, blocked }
    ),
    selected => {
      const cards = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
      effect.damage += 20;
    }
  );
}

export class DarkFlareon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Rage',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Dark Flareon.'
    },
    {
      name: 'Playing with Fire',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '30+',
      text:
        'Use this attack only if there are any R Energy cards attached to Dark Flareon. Flip a coin. If heads, ' +
        'discard 1 of those Energy cards and this attack does 30 damage plus 20 more damage; if tails, this attack ' +
        'does 30 damage.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Flareon';

  public fullName: string = 'Dark Flareon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = usePlayingWithFire(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
