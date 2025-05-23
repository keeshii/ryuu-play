import {
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCardList,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class StartlingMegaphone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Startling Megaphone';

  public fullName: string = 'Startling Megaphone FLF';

  public text: string = 'Discard all Pokémon Tool cards attached to each of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonsWithTool: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
          pokemonsWithTool.push(cardList);
        }
      });

      if (pokemonsWithTool.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      pokemonsWithTool.forEach(target => {
        if (target.tool !== undefined) {
          target.moveCardTo(target.tool, opponent.discard);
          target.tool = undefined;
        }
      });
    }

    return state;
  }
}
