import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class SilverBangle extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Silver Bangle';

  public fullName: string = 'Silver Bangle PLB';

  public text: string =
    'The attacks of the Pokemon this card is attached to (excluding ' +
    'Pokemon-EX) do 30 more damage to Active Pokemon-EX (before applying ' +
    'Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_EX)) {
        return state;
      }

      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage += 30;
      }
    }

    return state;
  }

}
