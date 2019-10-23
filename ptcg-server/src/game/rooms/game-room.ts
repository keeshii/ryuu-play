import { Action } from "../store/actions/action";
import { AddPlayerAction } from "../store/actions/add-player-action";
import { Arbiter } from "./arbiter";
import { GameInfo, PlayerInfo } from "./rooms.interface";
import { LobbyClient } from "./lobby-room";
import { Prompt } from "../store/prompts/prompt";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { logger } from "../../utils/logger";
import { deepCompare } from "../../utils/utils";

export interface GameClient extends RoomClient {
  room: GameRoom;
  lobbyClient: LobbyClient;
}

export class GameRoom extends Room<GameClient> implements StoreHandler {

  public id: number;
  public gameInfo: GameInfo;
  private arbiter = new Arbiter();
  private store: Store;

  constructor(id: number) {
    super();
    this.id = id;
    this.store = new Store(this);
    this.gameInfo = this.buildGameInfo(this.store.state);
  }

  public join(lobbyClient: LobbyClient): GameClient {
    let client = this.findClient(lobbyClient);
    if (client !== undefined) {
      return client;
    }
    client = this.joinRoom(lobbyClient.user);
    client.lobbyClient = lobbyClient;
    this.broadcast('game:join', client);
    return client;
  }

  public leave(client: GameClient) {
    super.leave(client);
    this.broadcast('game:leave', client);
    if (this.clients.length === 0) {
      this.destroy();
    }
  }

  public findClient(lobbyClient: LobbyClient): GameClient | undefined {
    return this.clients.find(c => c.lobbyClient === lobbyClient);
  }

  private destroy() {
    this.broadcast('game:destroy', this);
    this.clients.length === 0;
  }

  public play(client: GameClient, deck: string[]) {
    logger.log(`User ${client.user.name} starts playing at table ${this.id}.`);
    const action = new AddPlayerAction(client.id, client.user.name, deck);
    this.store.dispatch(action);
  }

  public dispatch(client: GameClient, action: Action) {
    logger.log(`User ${client.user.name} dispatches the action ${action.type}.`);
    this.store.dispatch(action);
  }

  public onStateStable(state: State) {
    this.broadcast('game:stateStable', state);

    const gameInfo = this.buildGameInfo(state);
    if (deepCompare(this.gameInfo, gameInfo)) {
      this.gameInfo = gameInfo;
      this.broadcast('game:gameInfo', gameInfo);
    }

    if (state.phase === GamePhase.FINISHED) {
      this.destroy();
    }
  }

  public onStateChange(state: State) {
    this.broadcast('game:stateChange', state);
  }

  public resolvePrompt(prompt: Prompt<any>): boolean {

    const resolved = this.arbiter.resolvePrompt(prompt);

    if (resolved === false) {
      const client = this.clients.find(c => c.user.name === prompt.player.name);
      if (client === undefined) {
        // user disconnected, opponent wins
        return false;
      }
      this.emitTo(client, 'game:prompt', prompt);
      return true;
    }

    return resolved;
  }

  private buildGameInfo(state: State): GameInfo {
    const players: PlayerInfo[] = state.players.map(player => ({
      clientId: player.clientId,
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
