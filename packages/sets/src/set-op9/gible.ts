import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { PlayerType, SlotType } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';


export class Gible extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{
    type: CardType.COLORLESS,
    value: 10
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Push Down',
    cost: [ CardType.COLORLESS ],
    damage: '10',
    text: 'Your opponent switches the Defending Pokemon with 1 of his or her ' +
      'Benched Pokemon.'
  }];

  public set: string = 'OP9';

  public name: string = 'Gible';

  public fullName: string = 'Gible OP9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          opponent.switchPokemon(targets[0]);
        }
      });
    }

    return state;
  }

}
