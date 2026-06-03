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

function* useContinuousFireball(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  store.reduceEffect(state, checkProvidedEnergy);

  // Count energy cards that are providing FIRE energy
  const coinFlipPrompts: CoinFlipPrompt[] = [];
  const blocked: number[] = [];
  checkProvidedEnergy.energyMap.forEach(em => {
    const index = player.active.energies.cards.indexOf(em.card);
    if (index === -1) {
      return; // make sure, that energy is attached to the active
    }
    if (em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)) {
      coinFlipPrompts.push(new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP));
    } else {
      blocked.push(index);
    }
  });

  // No fire energy card attached, nothing to flip
  if (coinFlipPrompts.length === 0) {
    return state;
  }

  // Flip a coin for each Energy Card
  let heads = 0;
  yield store.prompt(
    state,
    coinFlipPrompts,
    results => {
      results.forEach(r => {
        heads += r ? 1 : 0;
      });
      next();
    }
  );

  effect.damage = 50 * heads;

  // No heads, no need to discard anything
  if (heads === 0) {
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active.energies,
      { superType: SuperType.ENERGY },
      { min: heads, max: heads, allowCancel: false, blocked }
    ),
    selected => {
      const cards = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      return store.reduceEffect(state, discardEnergy);
    }
  );

}

export class DarkCharizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Charmeleon';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Nail Flick',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Continuous Fireball',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '50×',
      text:
        'Flip a number of coins equal to the number of R Energy cards attached to Dark Charizard. This attack does ' +
        '50 damage times the number of heads. Discard a number of R Energy cards attached to Dark Charizard equal ' +
        'to the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Charizard';

  public fullName: string = 'Dark Charizard TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useContinuousFireball(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
