import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { StoreLike, State, StateUtils, PowerType, ChoosePokemonPrompt,
  PlayerType, SlotType, GameMessage } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { PutDamageEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '@ptcg/common';


export class DarkraiEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Dark Cloak',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokemon that has any D Energy attached to it ' +
      'has no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Night Spear',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: '90',
      text: 'Does 30 damage to 1 of your opponent\'s Benched Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Darkrai EX';

  public fullName: string = 'Darkrai EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;

      let hasDarkraiInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasDarkraiInPlay = true;
        }
      });

      if (!hasDarkraiInPlay) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyMap = checkProvidedEnergyEffect.energyMap;
      const hasDarknessEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.DARK ]);

      if (hasDarknessEnergy) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.cost = [];
      }

      return state;
    }

    return state;
  }

}
