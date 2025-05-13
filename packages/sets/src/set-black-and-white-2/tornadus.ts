import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SuperType, EnergyType } from '@ptcg/common';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType,
  EnergyCard, MoveEnergyPrompt, CardTarget } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

export class Tornadus extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Energy Wheel',
      cost: [ CardType.COLORLESS ],
      damage: '',
      text: 'Move an Energy from 1 of your Benched Pokemon to this Pokemon.'
    }, {
      name: 'Hurricane',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: '80',
      text: 'Move a basic Energy from this Pokemon to 1 of your ' +
        'Benched Pokemon.'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Tornadus';

  public fullName: string = 'Tornadus EP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];

      let hasEnergyOnBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active) {
          blockedFrom.push(target);
          return;
        }
        blockedTo.push(target);
        if (cardList.cards.some(c => c instanceof EnergyCard)) {
          hasEnergyOnBench = true;
        }
      });

      if (hasEnergyOnBench === false) {
        return state;
      }

      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_TO_ACTIVE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false, blockedFrom, blockedTo }
      ), result => {
        const transfers = result || [];
        transfers.forEach(transfer => {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      const hasBasicEnergy = player.active.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
      });

      if (hasBench === false || hasBasicEnergy === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }

}
