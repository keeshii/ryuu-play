import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  Effect,
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

export class Delcatty2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skitty';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Energy Call',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Attach 1 Energy card from your discard pile to your Active Pokémon.',
    },
    {
      name: 'Cannonball',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 10 more damage for each Energy attached to Delcatty but not used to pay for this ' +
        'attack\'s Energy cost.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Delcatty';

  public fullName: string = 'Delcatty RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => c.superType === SuperType.ENERGY);
      if (!hasEnergyInDiscard) {
        return state;
      }

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_ACTIVE,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
          },
          { allowCancel: false, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkAttackCost = new CheckAttackCostEffect(player, effect.attack);
      state = store.reduceEffect(state, checkAttackCost);
      const attackCost = checkAttackCost.cost.length;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage += Math.max(0, (energyCount - attackCost) * 10);
    }

    return state;
  }
}
