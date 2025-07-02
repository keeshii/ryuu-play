import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Marill';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Drizzle',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If you have W Energy cards in your hand, attach as many W Energy cards as you like to any of your Active ' +
        'Pokémon.'
    },
    {
      name: 'Max Bubbles',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text:
        'Flip a coin for each Energy attached to all of your Active Pokémon. This attack does 30 damage times the ' +
        'number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Azumarill';

  public fullName: string = 'Azumarill SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        return state;
      }

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_ACTIVE,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            provides: [CardType.WATER],
          },
          { allowCancel: true, min: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target.energies);
          }
        }
      );

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      return flipDamageTimes.use(effect, energyCount, 30);
    }

    return state;
  }
}
