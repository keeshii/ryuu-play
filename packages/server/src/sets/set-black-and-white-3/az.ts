import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';
import { PlayerType, SlotType } from '@ptcg/common';

export class AZ extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'AZ';

  public fullName: string = 'AZ PFO';

  public text: string =
    'Put 1 of your Pokemon into your hand. (Discard all cards attached ' +
    'to that Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: false }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          cardList.moveCardsTo(pokemons, player.hand);
          cardList.moveTo(player.discard);
          cardList.clearEffects();
        }
      });
    }

    return state;
  }

}
