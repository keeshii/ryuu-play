import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCardList,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class PokemonFlute extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Pokémon Flute';

  public fullName: string = 'Pokémon Flute BS';

  public text: string =
    'Choose 1 Basic Pokémon card from your opponent\'s discard pile and put it onto his or her Bench. (You can\'t ' +
    'play Pokémon Flute if your opponent\'s Bench is full.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        opponent.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];
        if (cards.length > 0) {
          cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
          });

          player.hand.moveCardTo(this, player.discard);
        }
      });
    }

    return state;
  }
}
