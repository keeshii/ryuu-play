import { Card } from "../../game/store/card/card";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { EnergyCard } from "../../game/store/card/energy-card";
import { EnergyType, TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { GamePhase, State } from "../../game/store/state/state";
import { StateUtils } from "../../game/store/state-utils";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { ShowCardsPrompt } from "../../game/store/prompts/show-cards-prompt";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { KnockOutEffect } from "../../game/store/effects/game-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

function* playCard(next: Function, store: StoreLike, state: State,
  self: Rosa, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // No Pokemon KO last turn
  if (!player.marker.hasMarker(self.ROSA_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    const isPokemon = c instanceof PokemonCard;
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    const isTrainer = c instanceof TrainerCard;
    if (!isPokemon && !isBasicEnergy && !isTrainer) {
      blocked.push(index);
    }
  });

  // We will discard this card after prompt confirmation
  // This will prevent unblocked supporter to appear in the discard pile
  effect.preventDefault = true;

  const maxPokemons = 1;
  const maxEnergies = 1;
  const maxTrainers = 1;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 0, max: 3, allowCancel: true, blocked, maxPokemons, maxEnergies, maxTrainers }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardTo(self, player.supporter);
  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Rosa extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSH';

  public name: string = 'Rosa';

  public fullName: string = 'Rosa CEC';

  public text: string =
    'You can play this card only if 1 of your Pokemon was Knocked Out ' +
    'during your opponent\'s last turn. Search your deck for a Pokemon, ' +
    'a Trainer card, and a basic Energy card, reveal them, and put them ' +
    'into your hand. Then, shuffle your deck.';

  public readonly ROSA_MARKER = 'ROSA_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.ROSA_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ROSA_MARKER);
    }

    return state;
  }

}
