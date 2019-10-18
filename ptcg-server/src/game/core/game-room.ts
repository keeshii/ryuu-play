// import { RoomClient } from "./room-client";
// import { User } from "../../storage";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { LobbyRoom } from './lobby-room';
import { User } from "../../storage";
import { logger } from "../../utils/logger";

import { AddPlayerAction } from "../store/actions/add-player-action";
import { Arbiter } from "./arbiter";
import { Prompt } from "../store/prompts/prompt";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { Action } from "../store/actions/action";

export class GameRoom extends Room implements StoreHandler {

  public id: number;
  private arbiter = new Arbiter();
  private store: Store;

  constructor(private lobbyRoom: LobbyRoom, id: number) {
    super();
    this.id = id;
    this.store = new Store(this);
    this.on('game:action', this.dispatch.bind(this));
  }

  public join(user: User): RoomClient<GameRoom> {
    this.broadcast('game:join', user);
    return super.join(user);
  }

  public leave(client: RoomClient<GameRoom>) {
    super.leave(client);
    this.broadcast('game:leave', client.user);
    if (this.clients.length === 0) {
      this.destroy();
    }
  }

  private destroy() {
    this.broadcast('game:destroy', this);
    this.clients.length === 0;
    this.lobbyRoom.deleteGame(this);
  }

  public play(client: RoomClient<GameRoom>, deck: string[]) {
    logger.log(`User ${client.user.name} starts playing at table ${this.id}.`);
    const action = new AddPlayerAction(client.user.name, deck);
    this.store.dispatch(action);
  }

  public dispatch(client: RoomClient<GameRoom>, action: Action) {
    logger.log(`User ${client.user.name} dispatches the action ${action.type}.`);
    this.store.dispatch(action);
  }

  public onStateStable(state: State) {
    this.broadcast('game:stateStable', state);

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

}
