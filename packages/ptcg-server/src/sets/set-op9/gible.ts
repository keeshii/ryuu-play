import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';


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
    damage: 10,
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
