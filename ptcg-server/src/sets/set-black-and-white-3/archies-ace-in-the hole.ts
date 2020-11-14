import { Effect } from "../../game/store/effects/effect";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardType, SuperType } from "../../game/store/card/card-types";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";

export class ArchiesAceInTheHole extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'Archie\'s Ace in the Hole';

  public fullName: string = 'Archie\'s Ace in the Hole PCL';

  public text: string =
    'You can play this card only when it is the last card in your hand. ' +
    'Put a W Pokemon from your discard pile onto your Bench. ' +
    'Then, draw 5 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      const hasPokemon = player.discard.cards.some(c => {
        return c instanceof PokemonCard && c.cardType === CardType.WATER;
      });

      const slot = player.bench.find(b => b.cards.length === 0);
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

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON, cardType: CardType.WATER },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, slot);
        slot.pokemonPlayedTurn = state.turn;
        player.deck.moveTo(player.hand, 5);
      });
    }

    return state;
  }

}
