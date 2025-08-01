import {
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class MaxiesHiddenBallTrick extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'Maxie\'s Hidden Ball Trick';

  public fullName: string = 'Maxie\'s Hidden Ball Trick PCL';

  public text: string =
    'You can play this card only when it is the last card in your hand. ' +
    'Put a F Pokémon from your discard pile onto your Bench. ' +
    'Then, draw 5 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      const hasPokemon = player.discard.cards.some(c => {
        return c instanceof PokemonCard && c.cardTypes.includes(CardType.FIGHTING);
      });

      const slot = player.bench.find(b => b.pokemons.cards.length === 0);
      const hasEffect = (hasPokemon && slot) || player.deck.cards.length > 0;

      if (cards.length !== 0 || !hasEffect) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // It is not possible to recover Water Pokemon,
      // but we can still draw 5 cards
      if (!hasPokemon || slot === undefined) {
        player.deck.moveTo(player.hand, 5);
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, cardTypes: [CardType.FIGHTING] },
          { min: 1, max: 1, allowCancel: false }
        ),
        selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, slot.pokemons);
          slot.pokemonPlayedTurn = state.turn;
          player.deck.moveTo(player.hand, 5);
        }
      );
    }

    return state;
  }
}
