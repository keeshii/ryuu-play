import { CardManager } from '../cards/card-manager';
import { Client } from '../client/client.interface';
import { DeckAnalyser } from '../cards/deck-analyser';
import { Game } from '../core/game';
import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { User, Message, Deck } from '../../storage';
import { Core } from '../core/core';
import { State } from '../store/state/state';
import {GameSettings} from '../core/game-settings';

export abstract class BotClient implements Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public core: Core | undefined;
  public games: Game[] = [];

  constructor(name: string) {
    this.user = new User();
    this.user.name = name;
    this.name = name;
  }

  public abstract onConnect(client: Client): void;

  public abstract onDisconnect(client: Client): void;

  public abstract onUsersUpdate(users: User[]): void;

  public abstract onGameAdd(game: Game): void;

  public abstract onGameDelete(game: Game): void;

  public abstract onGameJoin(game: Game, client: Client): void;

  public abstract onGameLeave(game: Game, client: Client): void;

  public abstract onStateChange(game: Game, state: State): void;
  
  public abstract onMessage(from: Client, message: Message): void;

  public abstract onMessageRead(user: User): void;

  createGame(deck: string[], gameSettings?: GameSettings, invited?: Client): Game {
    if (this.core === undefined) {
      throw new GameError(GameMessage.ERROR_BOT_NOT_INITIALIZED);
    }
    const game = this.core.createGame(this, deck, gameSettings, invited);
    return game;
  }

  public async loadDeck(): Promise<string[]> {
    const deckRows = await Deck.find({
      user: { id: this.user.id },
      isValid: true
    });

    const decks = deckRows
      .map(d => JSON.parse(d.cards))
      .filter((cards: string[]) => this.validateDeck(cards));

    if (decks.length === 0) {
      throw new GameError(GameMessage.ERROR_BOT_NO_DECK);
    }

    const num = Math.round(Math.random() * (decks.length - 1));
    return decks[num];
  }

  private validateDeck(cards: string[]): boolean {
    const cardManager = CardManager.getInstance();
    if (cards.some(c => !cardManager.isCardDefined(c))) {
      return false;
    }

    const analyser = new DeckAnalyser(cards);
    return analyser.isValid();
  }

}
