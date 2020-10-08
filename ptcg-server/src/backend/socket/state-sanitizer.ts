import { AlertPrompt } from "../../game/store/prompts/alert-prompt";
import { Card } from "../../game/store/card/card";
import { CardList } from "../../game/store/state/card-list";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { Client } from "../../game/client/client.interface";
import { GameMessage } from "../../game/game-error";
import { SocketCache } from "./socket-cache";
import { State } from "../../game/store/state/state";
import { SuperType } from "../../game/store/card/card-types";
import { deepClone } from "../../utils";

export class StateSanitizer {

  private unknownCard: Card;

  constructor(
    private client: Client,
    private cache: SocketCache
  ) {
    this.unknownCard = {
      superType: SuperType.NONE,
      fullName: 'Unknown',
      name: 'Unknown',
      id: 0
    } as any;
  }

  /**
   * Clear sensitive data, resolved prompts and old logs.
   */
  public sanitize(state: State, gameId: number): State {
    state = deepClone(state);
    state = this.filterPrompts(state);
    state = this.removeLogs(state, gameId);
    state = this.hideSecretCards(state);
    return state;
  }

  private hideSecretCards(state: State) {
    if (state.cardNames.length === 0) {
      return state;
    }
    this.getSecretCardLists(state).forEach(cardList => {
      cardList.cards = cardList.cards.map(c => this.unknownCard);
    });
    return state;
  }

  private getSecretCardLists(state: State): CardList[] {
    const players = state.players.filter(p => p.id === this.client.id);
    const cardLists: CardList[] = [];
    players.forEach(player => {
      if (player.deck.isSecret) {
        cardLists.push(player.deck);
      }
      player.prizes.forEach(prize => {
        if (prize.isSecret) {
          cardLists.push(prize);
        }
      });
    });

    const opponents = state.players.filter(p => p.id !== this.client.id);
    opponents.forEach(opponent => {
      if (!opponent.hand.isPublic) {
        cardLists.push(opponent.hand);
      }
      if (!opponent.deck.isPublic) {
        cardLists.push(opponent.deck);
      }
      opponent.prizes.forEach(prize => {
        if (!prize.isPublic) {
          cardLists.push(prize);
        }
      });
    });

    state.prompts.forEach(prompt => {
      if (prompt instanceof ChooseCardsPrompt && prompt.options.isSecret) {
        cardLists.push(prompt.cards);
      }
    });

    return cardLists;
  }

  private filterPrompts(state: State): State {
    // Filter resolved prompts, not needed anymore

    state.prompts = state.prompts.filter(prompt => {
      return prompt.result === undefined
    });

    // Hide opponent's prompts. They may contain sensitive data.
    state.prompts = state.prompts.map(prompt => {
      if (prompt.playerId !== this.client.id) {
        return new AlertPrompt(prompt.playerId, GameMessage.NOT_YOUR_TURN);
      }
      return prompt;
    });

    state.prompts = deepClone(state.prompts);
    return state;
  }

  private removeLogs(state: State, gameId: number): State {
    // Remove logs, which were already send to client.
    const lastLogId = this.cache.lastLogIdCache[gameId];

    state.logs = state.logs.filter(log => log.id > lastLogId);
    if (state.logs.length > 0) {
      this.cache.lastLogIdCache[gameId] = state.logs[state.logs.length - 1].id;
    }

    return state;
  }

}
