import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public resistance = {
    types: [ CardType.COLORLESS ],
    value: -20
  };

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Impersonate', cost: [], damage: 0 },
    { name: 'Overconfident', cost: [CardType.DARK], damage: 10 }
  ];

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
/*
    // Ability Overreager
    if (effect.type === 'CHOOSE_STARTING_PLAYER') {
      const isPlayerActive = state.players[0].active.getPokemonCard() instanceof Sableye;
      const isOpponentActive = state.players[1].active.getPokemonCard() instanceof Sableye;
      if (isPlayerActive && !isOpponentActive) {
        effect.player = state.players[0];
        effect.preventDefault = true;
        return state;
      }
      if (!isPlayerActive && isOpponentActive) {
        effect.player = state.players[1];
        effect.preventDefault = true;
        return state;
      }
    }

    // Attack Impersonate
    if (effect.type === 'ATTACK_EFFECT' && effect.attack === this.attacks[0]) {
      store.prompt(state, )
      return state;
    }

    // Attack Overconfident
*/
    return state;
  }

}
