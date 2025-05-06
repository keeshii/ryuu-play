import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { PowerType, StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType,
  StateUtils } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { PlayPokemonEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { PutDamageEffect } from '@ptcg/common';


export class Golbat extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zubat';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ ];

  public powers = [{
    name: 'Sneaky Bite',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
      'Pokemon, you may put 2 damage counters on 1 of your opponent\'s Pokemon.'
  }];

  public attacks = [
    {
      name: 'Swoop Across',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'This attack does 10 damage to each of your opponent\'s Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'BW4';

  public name: string = 'Golbat';

  public fullName: string = 'Golbat PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 20;
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 10;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}
