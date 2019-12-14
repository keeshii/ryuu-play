import { Action } from "../store/actions/action";
import { Arbiter } from "./arbiter";
import { Client } from "./client";
import { Core } from "./core";
import { Prompt } from "../store/prompts/prompt";
import { State, GamePhase } from "../store/state/state";
import { Store } from "../store/store";
import { StoreHandler } from "../store/store-handler";
import { logger } from "../../utils/logger";
import {ResolvePromptAction} from "../store/actions/resolve-prompt-action";

export class Game implements StoreHandler {
 
  public id: number;
  public clients: Client[] = [];
  private arbiter = new Arbiter();
  private store: Store;
  private promptsInProgress: boolean = false;

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

  private async notifyStateChange(state: State): Promise<void> {
    if (this.promptsInProgress) {
      return;
    }

    if (await this.resolvePrompts(state)) {
      return;
    }

    this.clients.forEach(c => c.onStateChange(this, state));

    if (state.phase === GamePhase.FINISHED) {
      this.core.deleteGame(this);
    }
  }

  private async resolvePrompts(state: State): Promise<boolean> {
    const resolvedPrompts: Prompt<any>[] = [];
    for (let i = 0; i < state.prompts.length; i++) {
      let prompt = this.arbiter.resolvePrompt(state, state.prompts[i]);
      if (prompt !== null) {
        resolvedPrompts.push(prompt);
      }
    }

    if (resolvedPrompts.length === 0) {
      return false;
    }

    this.promptsInProgress = true;

    for (let i = 0; i < resolvedPrompts.length; i++) {
      await this.store.dispatch(new ResolvePromptAction(resolvedPrompts[i]));
    }

    this.promptsInProgress = false;

    this.notifyStateChange(this.store.state);
    return true;
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

  public dispatch(client: Client, action: Action) {
    logger.log(`User ${client.user.name} dispatches the action ${action.type}.`);
    this.store.dispatch(action);
  }

}
