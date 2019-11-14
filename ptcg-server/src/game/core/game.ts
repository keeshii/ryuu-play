import { Action } from "../store/actions/action";
import { AddPlayerAction } from "../store/actions/add-player-action";
import { Arbiter } from "./arbiter";
import { Client } from "./client";
import { Core } from "./core";
import { GameInfo, PlayerInfo } from "../rooms/rooms.interface";
import { Prompt } from "../store/prompts/prompt";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { deepCompare } from "../../utils/utils";
import { logger } from "../../utils/logger";

export class Game implements StoreHandler {
 
  public id: number;
  public clients: Client[] = [];
  public gameInfo: GameInfo;
  private arbiter = new Arbiter();
  private store: Store;

  constructor(private core: Core, id: number) {
    this.id = id;
    this.store = new Store(this);
    this.gameInfo = this.buildGameInfo(this.store.state);
  }

  public onStateStable(state: State): void {
    this.emit(c => c.onStateStable(this, state));

    const gameInfo = this.buildGameInfo(state);
    if (deepCompare(this.gameInfo, gameInfo)) {
      this.gameInfo = gameInfo;
      this.core.emit(c => c.onGameInfo(this));
    }

    if (state.phase === GamePhase.FINISHED) {
      this.core.deleteGame(this);
    }
  }

  public onStateChange(state: State): void {
    this.emit(c => c.onStateChange(this, state));
  }

  public resolvePrompt(prompt: Prompt<any>): boolean {
    const resolved = this.arbiter.resolvePrompt(prompt);

    if (resolved === false) {
      const client = this.clients.find(c => c.user.name === prompt.player.name);
      if (client === undefined) {
        // user disconnected, opponent wins
        return false;
      }
      return client.resolvePrompt(this, prompt);
    }

    return resolved;
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

  public dispatch(client: Client, action: Action) {
    logger.log(`User ${client.user.name} dispatches the action ${action.type}.`);
    this.store.dispatch(action);
  }

  public playGame(client: Client, deck: string[]): void {
    logger.log(`User ${client.user.name} starts playing at table ${this.id}.`);
    const action = new AddPlayerAction(client.user.name, deck);
    this.store.dispatch(action);
  }

  private buildGameInfo(state: State): GameInfo {
    const players: PlayerInfo[] = state.players.map(player => ({
      name: player.name,
      prizes: player.prizes.cards.length,
      deck: player.deck.cards.length
    }));
    return {
      gameId: this.id,
      phase: state.phase,
      turn: state.turn,
      activePlayer: state.activePlayer,
      players: players
    };
  }

}
