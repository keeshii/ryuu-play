import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardTag } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';

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
