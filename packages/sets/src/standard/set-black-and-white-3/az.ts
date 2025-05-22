import {
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class AZ extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'AZ';

  public fullName: string = 'AZ PFO';

  public text: string = 'Put 1 of your Pokémon into your hand. (Discard all cards attached to that Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        result => {
          const cardList = result.length > 0 ? result[0] : null;
          if (cardList !== null) {
            const pokemons = cardList.getPokemons();
            cardList.moveCardsTo(pokemons, player.hand);
            cardList.moveTo(player.discard);
            cardList.clearEffects();
          }
        }
      );
    }

    return state;
  }
}
