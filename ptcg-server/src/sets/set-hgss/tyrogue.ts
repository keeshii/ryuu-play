import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, StateUtils } from "../../game";
import { AttackEffect, DealDamageAfterWeaknessEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";

export class Tyrogue extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 30;

  public retreat = [ ];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue ' +
      'by attacks.'
  }];

  public attacks = [
    {
      name: 'Mischievous Punch',
      cost: [ ],
      damage: 30,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. ' +
        'Tyrogue is now Asleep.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Tyrogue';

  public fullName: string = 'Tyrogue HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage = 0;

      store.reduceEffect(state, new DealDamageAfterWeaknessEffect(
        player, 30, effect.attack, opponent.active, player.active));

      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
      return state;
    }

    if (effect instanceof DealDamageAfterWeaknessEffect) {
      if (effect.target.cards.includes(this)) {
        const pokemonCard = effect.target.getPokemonCard();
        const isAsleep = effect.target.specialConditions.includes(SpecialCondition.ASLEEP);
        if (pokemonCard === this && isAsleep) {
          effect.preventDefault = true;
        }
      }
    }

    return state;
  }

}
