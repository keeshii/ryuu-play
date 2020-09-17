import { Action } from "../store/actions/action";
import { Arbiter } from "./arbiter";
import { Client } from "../client/client.interface";
import { Core } from "./core";
import { GameSettings } from "./game-settings";
import { MatchRecorder } from "./match-recorder";
import { ResolvePromptAction } from "../store/actions/resolve-prompt-action";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";

export class Game implements StoreHandler {
 
  public id: number;
  public clients: Client[] = [];
  private arbiter = new Arbiter();
  private store: Store;
  private matchRecorder: MatchRecorder;

  constructor(private core: Core, id: number, private gameSettings: GameSettings) {
    this.id = id;
    this.store = new Store(this);
    this.store.state.rules = gameSettings.rules;
    this.matchRecorder = new MatchRecorder(core);
  }

  public get state(): State {
    return this.store.state;
  }

  public onStateChange(state: State): void {
    this.notifyStateChange(state);
    if (this.gameSettings.recordingEnabled) {
      this.matchRecorder.onStateChange(state);
    }
  }

  private notifyStateChange(state: State): void {
    if (this.handleArbiterPrompts(state)) {
      return;
    }

    this.core.emit(c => c.onStateChange(this, state));

    if (state.phase === GamePhase.FINISHED) {
      this.core.deleteGame(this);
    }
  }

  private handleArbiterPrompts(state: State): boolean {
    let resolved: {id: number, action: ResolvePromptAction} | undefined;
    const unresolved = state.prompts.filter(item => item.result === undefined);

    for (let i = 0; i < unresolved.length; i++) {
      let action = this.arbiter.resolvePrompt(state, unresolved[i]);
      if (action !== undefined) {
        resolved = { id: unresolved[i].id, action };
        break;
      }
    }

    if (resolved === undefined) {
      return false;
    }

    this.store.dispatch(resolved.action);
    return true;
  }

  public dispatch(client: Client, action: Action): State {
    return this.store.dispatch(action);
  }

}
