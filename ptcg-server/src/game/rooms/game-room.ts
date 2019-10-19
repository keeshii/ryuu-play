
import { Action } from "../store/actions/action";
import { AddPlayerAction } from "../store/actions/add-player-action";
import { Arbiter } from "./arbiter";
import { GameInfo, PlayerInfo } from "./game-info.interface";
import { Prompt } from "../store/prompts/prompt";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { User } from "../../storage";
import { logger } from "../../utils/logger";
import { deepCompare } from "../../utils/utils";

export class GameRoom extends Room implements StoreHandler {

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
    const players: PlayerInfo[] = state.players.map(player => {
      const client = this.clients.find(client => client.user.name === player.name);
      const userId = client !== undefined ? client.user.id : 0;
      return {
        userId: userId,
        name: player.name,
        prizes: player.prizes.cards.length,
        deck: player.deck.cards.length
      }
    });
    return {
      gameId: this.id,
      phase: state.phase,
      turn: state.turn,
      activePlayer: state.activePlayer,
      players: players
    };
  }

}