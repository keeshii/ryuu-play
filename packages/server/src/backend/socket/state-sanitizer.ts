import { AlertPrompt } from '@ptcg/common';
import { Card } from '@ptcg/common';
import { CardList } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { Client } from '../../game/client/client.interface';
import { GameMessage } from '@ptcg/common';
import { SocketCache } from './socket-cache';
import { State } from '@ptcg/common';
import { SuperType } from '@ptcg/common';
import { deepClone } from '@ptcg/common';

export class StateSanitizer {

  constructor(
    private client: Client,
    private cache: SocketCache
  ) { }

  /**
   * Clear sensitive data, resolved prompts and old logs.
   */
  public sanitize(state: State, gameId: number): State {
    state = deepClone(state, [ Card ]);
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
      cardList.cards = cardList.cards.map((c, i) => this.createUnknownCard(i));
    });
    return state;
  }

  private createUnknownCard(index: number): Card {
    return {
      superType: SuperType.NONE,
      fullName: 'Unknown',
      name: 'Unknown',
      id: index
    } as any;
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
      return prompt.result === undefined;
    });

    // Hide opponent's prompts. They may contain sensitive data.
    state.prompts = state.prompts.map(prompt => {
      if (prompt.playerId !== this.client.id) {
        return new AlertPrompt(prompt.playerId, GameMessage.NOT_YOUR_TURN);
      }
      return prompt;
    });

    // Cards in the prompt are known, in the game cards are secret,
    // For example, serching for the cards from deck.
    // The method hideSecretCards would hide cards from prompt as well.
    state.prompts = deepClone(state.prompts, [ Card ]);
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
