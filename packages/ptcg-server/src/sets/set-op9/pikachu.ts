import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PokemonCardList } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Pikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING, value: 10 }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Growl',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done by attacks ' +
        'from the Defending Pokemon is reduced by 20 (before applying ' +
        'Weakness and Resistance).'
    },
    {
      name: 'Numb',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'If Pikachu evolved from Pichu during this turn, the Defending ' +
        'Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'OP9';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu OP9';

  public readonly GROWL_MARKER = 'GROWL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.GROWL_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList)) {
        return state;
      }
      if (cardList.pokemonPlayedTurn === state.turn && !cardList.isBasic()) {
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialCondition);
      }
      return state;
    }

    if (effect instanceof DealDamageEffect && effect.source.marker.hasMarker(this.GROWL_MARKER, this)) {
      const reducedDamage = Math.max(0, effect.damage - 20);
      effect.damage = reducedDamage;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.GROWL_MARKER);
    }

    return state;
  }

}
