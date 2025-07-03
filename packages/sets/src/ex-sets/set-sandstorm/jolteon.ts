import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ConfirmPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Jolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Double Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Lightning Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '40',
      text:
        'You may discard all L Energy cards attached to Jolteon. If you do, this attack\'s base damage is 70 instead ' +
        'of 40.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.METAL, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Jolteon';

  public fullName: string = 'Jolteon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipDamageTimes.use(effect, 2, 20);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_DISCARD_ENERGY), result => {
        if (result) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          store.reduceEffect(state, checkProvidedEnergy);

          const cards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            if (em.provides.includes(CardType.LIGHTNING) || em.provides.includes(CardType.ANY)) {
              cards.push(em.card);
            }
          });

          effect.damage = 70;
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        }
      });
    }

    return state;
  }
}
