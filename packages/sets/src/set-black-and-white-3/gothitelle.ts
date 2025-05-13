import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { PowerType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { PlayItemEffect } from '@ptcg/common';
import { CheckProvidedEnergyEffect } from '@ptcg/common';

export class Gothitelle extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gothorita';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 130;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Magic Room',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, your opponent ' +
      'can\'t play any Item cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Madkinesis',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: '30+',
    text: 'Does 20 more damage for each P Energy attached to this Pokemon.'
  }];

  public set: string = 'BW3';

  public name: string = 'Gothitelle';

  public fullName: string = 'Gothitelle LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let psychicEnergies = 0;
      checkProvidedEnergyEffect.energyMap.forEach(energy => {
        energy.provides.forEach(c => {
          psychicEnergies += c === CardType.PSYCHIC ? 1 : 0;
        });
      });

      effect.damage += 20 * psychicEnergies;
      return state;
    }

    // Block trainer cards
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      // Gothitelle is not Active Pokemon
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }

}
