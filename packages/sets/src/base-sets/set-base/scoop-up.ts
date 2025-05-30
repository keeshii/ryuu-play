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

export class ScoopUp extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Scoop Up';

  public fullName: string = 'Scoop Up BS';

  public text: string =
    'Choose 1 of your Pokémon in play and return its Basic Pokémon card to your hand. (Discard all cards attached ' +
    'to that card.)';

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
          const cardList = result[0];
          const pokemonCards = cardList.getPokemons();

          if (pokemonCards.length > 0) {
            cardList.moveCardTo(pokemonCards[0], player.hand);
          }

          cardList.moveTo(player.discard);
          cardList.clearEffects();
        }
      );
    }

    return state;
  }
}
