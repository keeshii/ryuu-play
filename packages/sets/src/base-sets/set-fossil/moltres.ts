import {
  AttackEffect,
  Card,
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
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Wildfire',
      cost: [CardType.FIRE],
      damage: '',
      text:
        'You may discard any number of R Energy cards attached to Moltres when you use this attack. If you do, ' +
        'discard that many cards from the top of your opponent\'s deck.'
    },
    {
      name: 'Dive Bomb',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '80',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Block energies that doesn't provide R Energy
      const blocked: number[] = [];
      player.active.energies.cards.forEach((card, index) => {
        const energyMap = checkProvidedEnergy.energyMap.find(em => em.card === card);
        const provides: CardType[] = energyMap ? energyMap.provides : [];
        if (provides.every(ct => ct !== CardType.FIRE && ct !== CardType.ANY)) {
          blocked.push(index);
        }
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active.energies,
          {},
          { min: 0, allowCancel: false, blocked }
        ),
        selected => {
          const cards: Card[] = selected || [];

          if (cards.length === 0) {
            return;
          }

          // Count how many R Energy provide selected cards
          let energyCount = 0;
          for (const card of cards) {
            const energyMap = checkProvidedEnergy.energyMap.find(em => em.card === card);
            const provides: CardType[] = energyMap ? energyMap.provides : [];
            for (const cardType of provides) {
              if (cardType === CardType.FIRE || cardType == CardType.ANY) {
                energyCount += 1;
              }
            }
          }

          // Discard energies
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          // Discard that many cards from opponent's deck
          opponent.deck.moveTo(opponent.discard, energyCount);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
