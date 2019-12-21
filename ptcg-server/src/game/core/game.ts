import { Action } from "../store/actions/action";
import { Arbiter } from "./arbiter";
import { Client } from "./client";
import { Core } from "./core";
import { ResolvePromptAction } from "../store/actions/resolve-prompt-action";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { logger } from "../../utils/logger";

export class Game implements StoreHandler {
 
  public id: number;
  public clients: Client[] = [];
  private arbiter = new Arbiter();
  private store: Store;

  constructor(private core: Core, id: number) {
    this.id = id;
    this.store = new Store(this);
  }

  public get state(): State {
    return this.store.state;
  }

  public onStateChange(state: State): void {
    this.notifyStateChange(state);
  }

  private notifyStateChange(state: State): void {
    if (this.handleArbiterPrompts(state)) {
      return;
    }

    this.clients.forEach(c => c.onStateChange(this, state));

    if (state.phase === GamePhase.FINISHED) {
      this.core.deleteGame(this);
    }
  }

  private handleArbiterPrompts(state: State): boolean {
    const resolved: {id: number, result: any}[] = [];
    const unresolved = state.prompts.filter(item => item.result === undefined);

    for (let i = 0; i < unresolved.length; i++) {
      let result = this.arbiter.resolvePrompt(state, unresolved[i]);
      if (result !== undefined) {
        resolved.push({ id: unresolved[i].id, result });
      }
    }

    if (resolved.length === 0) {
      return false;
    }

    for (let i = 0; i < resolved.length; i++) {
      this.store.dispatch(new ResolvePromptAction(resolved[i].id, resolved[i].result));
    }

    this.notifyStateChange(state);
    return true;
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

  public dispatch(client: Client, action: Action): State {
    logger.log(`User ${client.user.name} dispatches the action ${action.type}.`);
    return this.store.dispatch(action);
  }

}
